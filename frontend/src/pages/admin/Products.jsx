import { useEffect, useState } from 'react'
import { Plus, ImagePlus, X } from 'lucide-react'
import ProductRows from '../../components/ProductRows'
import { Modal, Confirm, Loading } from '../../components/ui'
import { useStore } from '../../context/StoreContext'
import useTitle from '../../hooks/useTitle'

function Form({ init, categories, onSave, onClose }) {
  const [f, setF] = useState(init)
  const [err, setErr] = useState('')
  const [imgs, setImgs] = useState([])
  const [removedImageIds, setRemovedImageIds] = useState([])
  const [newPreviews, setNewPreviews] = useState([])
  const [saving, setSaving] = useState(false)

  const existingImages = (init.images || []).filter(
    image => !removedImageIds.includes(image.id)
  )

  const set = key => e =>
    setF({ ...f, [key]: e.target.value })

  // Generate previews for newly selected images
  useEffect(() => {
    const previews = imgs.map(file =>
      URL.createObjectURL(file)
    )

    setNewPreviews(previews)

    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [imgs])

  // Remove an existing Cloudinary image
  const removeExistingImage = id => {
    setRemovedImageIds(current => [...current, id])
    setErr('')
  }

  // Remove a newly selected image
  const removeNewImage = index => {
    setImgs(current =>
      current.filter((_, i) => i !== index)
    )
    setErr('')
  }

  // Select and validate images
  const handleImageSelection = e => {
    const selected = Array.from(e.target.files || [])

    e.target.value = ''

    if (!selected.length) return

    const invalid = selected.filter(
      file => !file.type.startsWith('image/')
    )

    if (invalid.length) {
      setErr('Please select valid image files.')
      return
    }

    const oversized = selected.filter(
      file => file.size > 5 * 1024 * 1024
    )

    if (oversized.length) {
      setErr('Each image must be smaller than 5 MB.')
      return
    }

    const availableSlots =
      8 - existingImages.length - imgs.length

    if (availableSlots <= 0) {
      setErr('A product can have a maximum of 8 images.')
      return
    }

    const accepted = selected.slice(0, availableSlots)

    setImgs(current => [...current, ...accepted])

    if (accepted.length < selected.length) {
      setErr('A product can have a maximum of 8 images.')
    } else {
      setErr('')
    }
  }

  // Save product
  const save = async () => {
    if (!f.name.trim()) {
      setErr('Enter a product name')
      return
    }

    if (!(Number(f.price) > 0)) {
      setErr('Enter a price above ₹0')
      return
    }

    if (!f.category) {
      setErr('Please select a category')
      return
    }

    setSaving(true)
    setErr('')

    try {
      await onSave({
        ...f,
        name: f.name.trim(),
        price: Number(f.price),
        newImages: imgs,
        remove_image_ids: removedImageIds,
      })
    } catch (error) {
      setErr(error.message || 'Unable to save the product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal onClose={saving ? () => {} : onClose}>
      <h3 className="text-xl">
        {init.id ? 'Edit product' : 'Add new product'}
      </h3>

      <label className="block text-sm text-ink/70">
        Name
        <input
          className="input mt-1"
          value={f.name}
          onChange={set('name')}
          disabled={saving}
        />
      </label>

      <label className="block text-sm text-ink/70">
        Price (₹)
        <input
            className="input mt-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            type="number"
            min="1"
            step="1"
            value={f.price}
            onChange={set('price')}
            disabled={saving}
        />
      </label>

      <label className="block text-sm text-ink/70">
        Category
        <select
          className="input mt-1"
          value={f.category}
          onChange={set('category')}
          disabled={saving}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm text-ink/70">
        Description
        <textarea
          className="input mt-1"
          rows="3"
          value={f.description}
          onChange={set('description')}
          disabled={saving}
        />
      </label>

      {/* Image management */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink/70">
            Product images
          </p>

          <span className="text-xs text-ink/50">
            {existingImages.length + imgs.length}/8 images
          </span>
        </div>

        {/* Existing and newly selected image previews */}
        {(existingImages.length > 0 || imgs.length > 0) && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {existingImages.map((image, index) => (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-xl bg-beige"
              >
                <img
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  className="size-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeExistingImage(image.id)}
                  disabled={saving}
                  aria-label="Remove existing image"
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white text-ink shadow-md hover:bg-[#a6544a] hover:text-white"
                >
                  <X size={15} />
                </button>

                <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] text-ink">
                  Existing
                </span>
              </div>
            ))}

            {newPreviews.map((preview, index) => (
              <div
                key={`${imgs[index]?.name}-${index}`}
                className="relative aspect-square overflow-hidden rounded-xl bg-beige"
              >
                <img
                  src={preview}
                  alt={`New product image ${index + 1}`}
                  className="size-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  disabled={saving}
                  aria-label="Remove selected image"
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white text-ink shadow-md hover:bg-[#a6544a] hover:text-white"
                >
                  <X size={15} />
                </button>

                <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] text-ink">
                  New
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <label className="mt-3 flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed border-beige p-4 text-center text-sm text-ink/60 hover:bg-beige/30">
          <ImagePlus size={20} />

          <span>Add product images</span>

          <span className="text-xs">
            Select multiple images
          </span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            disabled={saving || existingImages.length + imgs.length >= 8}
            onChange={handleImageSelection}
          />
        </label>

        <p className="mt-2 text-xs text-ink/50">
          JPG, PNG and WebP. Maximum 5 MB per image and 8 images per product.
        </p>
      </div>

      {err && (
        <p role="alert" className="text-sm text-[#a6544a]">
          {err}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          className="btn btn-out btn-sm"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          className="btn btn-pri btn-sm"
          onClick={save}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save product'}
        </button>
      </div>
    </Modal>
  )
}

export default function Products() {
  useTitle('Products | Admin')

  const s = useStore()

  const [form, setForm] = useState(null)
  const [del, setDel] = useState(null)

  if (s.loading) return <Loading />

  const blank = {
    name: '',
    price: '',
    category: s.categories[0] || '',
    description: '',
    status: 'available',
    featured: false,
    best: false,
    specs: [],
    images: [],
  }

  const save = async value => {
    if (value.id) {
      await s.updateProduct(value.id, value)
    } else {
      await s.addProduct(value)
    }

    setForm(null)
  }

  const toggleStatus = async product => {
    const next = product.status === 'sold'
      ? 'available'
      : 'sold'

    try {
      await s.setStatus(product.id, next)

      s.notify(
        next === 'sold'
          ? 'Marked as sold'
          : 'Marked as available'
      )
    } catch {
      // StoreContext already displays the API error.
    }
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl">
          Products
        </h1>

        <button
          className="btn btn-pri btn-sm"
          onClick={() => setForm(blank)}
        >
          <Plus size={15} />
          Add product
        </button>
      </div>

      <ProductRows
        items={s.products}
        onEdit={product => setForm(product)}
        onDelete={setDel}
        onToggle={toggleStatus}
      />

      {form && (
        <Form
          init={form}
          categories={s.categories}
          onSave={save}
          onClose={() => setForm(null)}
        />
      )}

      {del && (
        <Confirm
          title={`Delete “${del.name}”?`}
          text="This removes the product from the website. You can't undo this."
          yes="Delete product"
          onNo={() => setDel(null)}
          onYes={async () => {
            try {
              await s.deleteProduct(del.id)
              setDel(null)
            } catch {
              // StoreContext already displays the API error.
            }
          }}
        />
      )}
    </>
  )
}