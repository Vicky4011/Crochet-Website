import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { Loading } from '../../components/ui'
import useTitle from '../../hooks/useTitle'

export default function Settings() {
  useTitle('Settings | Admin')

  const s = useStore()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  const v = form || s.settings

  const set = key => e => {
    setForm({
      ...v,
      [key]: e.target.value
    })
  }

  if (s.loading) return <Loading />

  // Collect all uploaded product images.
  const allImages = s.products.flatMap(product =>
    (product.images || []).map(image => ({
      ...image,
      productName: product.name
    }))
  )

  const getImage = id =>
    allImages.find(image => String(image.id) === String(id))

  const save = async () => {
    const whatsapp = String(v.whatsapp || '').replace(/\D/g, '')

    if (whatsapp.length < 10) {
      return s.notify(
        'Enter the WhatsApp number with country code'
      )
    }

    setSaving(true)

    try {
      await s.saveSettings({
        ...v,
        whatsapp,
        homepageImageId: v.homepageImageId
          ? Number(v.homepageImageId)
          : null,
        aboutImageId: v.aboutImageId
          ? Number(v.aboutImageId)
          : null
      })

      setForm(null)
    } catch {
      // StoreContext displays the error.
    } finally {
      setSaving(false)
    }
  }

  const ImageSelector = ({ title, field, description }) => {
    const selected = getImage(v[field])

    return (
      <div className="rounded-2xl border border-beige bg-card p-4 sm:p-5">
        <h3 className="text-lg">{title}</h3>

        <p className="mt-1 text-sm text-ink/60">
          {description}
        </p>

        <select
          className="input mt-4"
          value={v[field] || ''}
          onChange={e =>
            setForm({
              ...v,
              [field]: e.target.value
            })
          }
        >
          <option value="">Automatically use first product image</option>

          {allImages.map(image => (
            <option
              key={image.id}
              value={image.id}
            >
              {image.productName} — Image #{image.id}
            </option>
          ))}
        </select>

        <div className="mt-4 flex min-h-36 items-center justify-center overflow-hidden rounded-xl bg-beige">
          {selected ? (
            <img
              src={selected.url}
              alt={title}
              className="max-h-56 w-full object-cover"
            />
          ) : (
            <p className="p-5 text-center text-sm text-ink/50">
              No specific image selected.
              <br />
              The website will use its automatic fallback.
            </p>
          )}
        </div>
      </div>
    )
  }

  const fields = [
    ['businessName', 'Business name'],
    ['whatsapp', 'WhatsApp number (with country code)'],
    ['email', 'Contact email'],
    ['phone', 'Contact phone']
  ]

  return (
    <>
      <h1 className="mb-6 text-2xl sm:text-3xl">
        Settings
      </h1>

      <div className="max-w-3xl space-y-7">

        {/* Business information */}
        <section>
          <h2 className="mb-3 text-xl">
            Business information
          </h2>

          <div className="space-y-4">
            {fields.map(([key, label]) => (
              <label
                key={key}
                className="block text-sm text-ink/70"
              >
                {label}

                <input
                  className="input mt-1"
                  value={v[key] || ''}
                  onChange={set(key)}
                />
              </label>
            ))}
          </div>
        </section>

        {/* Homepage and About image selection */}
        <section>
          <h2 className="mb-2 text-xl">
            Homepage and About images
          </h2>

          <p className="mb-4 text-sm text-ink/60">
            Choose which uploaded product images should
            appear in these website sections.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <ImageSelector
              title="Homepage hero image"
              field="homepageImageId"
              description="The main image displayed on the homepage."
            />

            <ImageSelector
              title="About section image"
              field="aboutImageId"
              description="The image displayed in the Our Story section."
            />
          </div>

          {allImages.length === 0 && (
            <p className="mt-3 rounded-xl bg-beige p-3 text-sm text-ink/60">
              Upload product images first. They will appear here
              automatically.
            </p>
          )}
        </section>

        {/* Featured products */}
        <section>
          <h2 className="mb-3 text-xl">
            Homepage featured products
          </h2>

          <div className="space-y-2">
            {s.products.map(product => (
              <label
                key={product.id}
                className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 text-sm"
              >
                <input
                  type="checkbox"
                  className="size-4 accent-[#795548]"
                  checked={product.featured}
                  onChange={e =>
                    s.updateProduct(product.id, {
                      featured: e.target.checked
                    })
                  }
                />

                {product.name}
              </label>
            ))}
          </div>
        </section>

        <button
          className="btn btn-pri"
          onClick={save}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>

      </div>
    </>
  )
}