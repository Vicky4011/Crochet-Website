import { catArt } from '../data/seed'

const API_BASE = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
).replace(/\/$/, '')

const TOKEN_KEY = 'loop-lane-token'

let categoryRecords = []

// --------------------------------------
// Authentication
// --------------------------------------

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// --------------------------------------
// API request handler
// --------------------------------------

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const authToken = getToken()

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  let response

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error(
      'Cannot reach the server. Check that the API is running and try again.'
    )
  }

  if (response.status === 204) return null

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 401 && authToken) {
      localStorage.removeItem(TOKEN_KEY)
    }

    const detail = data.detail

    const message = Array.isArray(detail)
      ? detail.map(item => item.msg).join(', ')
      : detail || `Request failed (${response.status})`

    throw new Error(message)
  }

  return data
}

// --------------------------------------
// Product formatting
// --------------------------------------

function productFromApi(product) {
  return {
    ...product,
    art: {
      t: catArt[product.category] || 'bag',
      c: '#a98f7a',
      bg: '#eee4d6',
    },
    images: product.images || [],
  }
}

// --------------------------------------
// Settings formatting
// --------------------------------------

function settingsFromApi(settings) {
  return {
    businessName:
      settings.businessName ||
      settings.business_name ||
      'Loop & Lane Crochet',

    whatsapp: settings.whatsapp || '',
    email: settings.email || '',
    phone: settings.phone || '',
  }
}

// --------------------------------------
// Categories
// --------------------------------------

export async function getCategories() {
  categoryRecords = await request('/categories')

  return categoryRecords.map(category => category.name)
}

export async function getCategoryRecords() {
  categoryRecords = await request('/categories')
  return categoryRecords
}

async function ensureCategories() {
  if (!categoryRecords.length) {
    await getCategoryRecords()
  }
}

// --------------------------------------
// Product FormData
// --------------------------------------

async function productPayload(product, partial = false) {
  const data = new FormData()

  const has = key =>
    Object.prototype.hasOwnProperty.call(product, key)

  const append = (key, value) => {
    if (value !== undefined && value !== null) {
      data.append(key, String(value))
    }
  }

  // Name
  if (!partial || has('name')) {
    append('name', product.name)
  }

  // Description
  if (!partial || has('description')) {
    append('description', product.description ?? '')
  }

  // Price
  if (!partial || has('price')) {
    const price = Number(product.price)

    if (!Number.isFinite(price) || price <= 0) {
      throw new Error('Enter a valid product price')
    }

    append('price', Math.round(price))
  }

  // Category
  if (!partial || has('category_id') || has('category')) {
    await ensureCategories()

    let categoryId = product.category_id

    // Always resolve the selected category name first.
    // This prevents an old category_id from being submitted
    // when the admin changes the category in the edit form.
    if (product.category) {
      const selectedCategory = categoryRecords.find(
        category => category.name === product.category
      )

      if (!selectedCategory) {
        throw new Error('Please select a valid category')
      }

      categoryId = selectedCategory.id
    }

    if (!categoryId && !partial) {
      throw new Error('Please select a valid category')
    }

    if (categoryId) {
      append('category_id', categoryId)
    }
  }

  // Status
  if (!partial || has('status')) {
    append('status', product.status || 'available')
  }

  // Featured
  if (!partial || has('featured')) {
    append('featured', !!product.featured)
  }

  // Best seller
  if (!partial || has('best')) {
    append('best', !!product.best)
  }

  // Specifications
  if (!partial || has('specs')) {
    append('specs', JSON.stringify(product.specs || []))
  }

  // New image uploads
  if (Array.isArray(product.newImages)) {
    product.newImages.forEach(file => {
      if (typeof File !== 'undefined' && file instanceof File) {
        data.append('images', file)
      }
    })
  }

  // Existing image removal
  const removeIds =
    product.remove_image_ids ||
    product.removeImageIds ||
    []

  if (removeIds.length) {
    data.append(
      'remove_image_ids',
      JSON.stringify(removeIds)
    )
  }

  return data
}

// --------------------------------------
// Products
// --------------------------------------

export async function getProducts() {
  const products = await request('/products')
  return products.map(productFromApi)
}

export async function getProduct(id) {
  return productFromApi(await request(`/products/${id}`))
}

export async function createProduct(product) {
  const body = await productPayload(product)

  return productFromApi(
    await request('/products', {
      method: 'POST',
      body,
    })
  )
}

export async function updateProduct(id, patch) {
  const body = await productPayload(patch, true)

  return productFromApi(
    await request(`/products/${id}`, {
      method: 'PUT',
      body,
    })
  )
}

export async function deleteProduct(id) {
  return request(`/products/${id}`, {
    method: 'DELETE',
  })
}

export async function setStatus(id, status) {
  return productFromApi(
    await request(`/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  )
}

// --------------------------------------
// Category management
// --------------------------------------

export async function addCategory(name) {
  const category = await request('/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })

  categoryRecords.push(category)

  return category
}

export async function renameCategory(oldName, newName) {
  await ensureCategories()

  const category = categoryRecords.find(
    item => item.name === oldName
  )

  if (!category) {
    throw new Error('Category not found. Refresh and try again.')
  }

  const updated = await request(`/categories/${category.id}`, {
    method: 'PUT',
    body: JSON.stringify({ name: newName }),
  })

  categoryRecords = categoryRecords.map(item =>
    item.id === category.id ? updated : item
  )

  return updated
}

export async function deleteCategory(name) {
  await ensureCategories()

  const category = categoryRecords.find(
    item => item.name === name
  )

  if (!category) {
    throw new Error('Category not found. Refresh and try again.')
  }

  await request(`/categories/${category.id}`, {
    method: 'DELETE',
  })

  categoryRecords = categoryRecords.filter(
    item => item.id !== category.id
  )
}

// --------------------------------------
// Website settings
// --------------------------------------

export async function getSettings() {
  return settingsFromApi(await request('/settings'))
}

export async function updateSettings(settings) {
  const payload = {
    businessName: settings.businessName,
    whatsapp: String(settings.whatsapp || '').replace(/\D/g, ''),
    email: settings.email || '',
    phone: settings.phone || '',
  }

  return settingsFromApi(
    await request('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  )
}

// --------------------------------------
// Admin authentication
// --------------------------------------

export async function login(email, password) {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  localStorage.setItem(TOKEN_KEY, result.access_token)

  return result.user
}

export async function logout() {
  try {
    if (getToken()) {
      await request('/auth/logout', {
        method: 'POST',
      })
    }
  } finally {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function session() {
  const authToken = getToken()

  return authToken ? { token: authToken } : null
}

export async function me() {
  return request('/auth/me')
}