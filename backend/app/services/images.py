import logging

from fastapi import HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

import cloudinary
import cloudinary.uploader

from app.core.config import settings


logger = logging.getLogger(__name__)

_MAGIC = [
    (b"\xff\xd8\xff", "image/jpeg"),
    (b"\x89PNG\r\n\x1a\n", "image/png"),
]


def _kind(data: bytes) -> str | None:
    for sig, mime in _MAGIC:
        if data.startswith(sig):
            return mime

    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"

    return None


def optimized(url: str) -> str:
    """Return a Cloudinary-optimized image URL."""
    return url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_1200/",
        1
    )


async def read_and_validate(files: list[UploadFile]) -> list[bytes]:

    files = [
        f for f in files
        if f and f.filename
    ]

    if len(files) > settings.MAX_IMAGES:
        raise HTTPException(
            422,
            f"You can upload up to {settings.MAX_IMAGES} images at a time"
        )

    out = []

    for f in files:

        data = await f.read(
            settings.MAX_IMAGE_MB * 1024 * 1024 + 1
        )

        if len(data) > settings.MAX_IMAGE_MB * 1024 * 1024:
            raise HTTPException(
                422,
                f"{f.filename} is larger than {settings.MAX_IMAGE_MB} MB"
            )

        if _kind(data) is None:
            raise HTTPException(
                422,
                f"{f.filename} isn't a JPG, PNG or WebP image"
            )

        out.append(data)

    return out


async def upload_all(blobs: list[bytes]) -> list[dict]:

    if not blobs:
        return []

    if not cloudinary.config().cloud_name:
        raise HTTPException(
            503,
            "Image uploads aren't configured yet. Set CLOUDINARY_URL on the server."
        )

    done = []

    try:

        for blob in blobs:

            result = await run_in_threadpool(
                cloudinary.uploader.upload,
                blob,
                folder="crochet-store",
                resource_type="image"
            )

            done.append({
                "url": result["secure_url"],
                "public_id": result["public_id"]
            })

    except Exception:

        logger.exception("Cloudinary image upload failed")

        await delete_all([
            item["public_id"]
            for item in done
        ])

        raise HTTPException(
            502,
            "Image upload failed. Check the backend terminal."
        )

    return done


async def delete_all(public_ids: list[str]) -> None:

    for public_id in public_ids:

        try:

            await run_in_threadpool(
                cloudinary.uploader.destroy,
                public_id
            )

        except Exception:

            logger.exception(
                "Failed to delete Cloudinary image: %s",
                public_id
            )