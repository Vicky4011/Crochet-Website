import { catArt } from '../data/seed'
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
const TOKEN_KEY = 'loop-lane-token'
let categoryRecords = []

function token() { return localStorage.getItem(TOKEN_KEY) }
async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  if (token()) headers.set('Authorization', `Bearer ${token()}`)
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  let response
  try { response = await fetch(`${API_BASE}${path}`, { ...options, headers }) }
  catch { throw new Error('Cannot reach the server. Check that the API is running and try again.') }
  if (response.status === 204) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = data.detail
    throw new Error(Array.isArray(detail) ? detail.map(x => x.msg).join(', ') : (detail || `Request failed (${response.status})`))
  }
  return data
}

const productFromApi = p => ({ ...p, art: { t: catArt[p.category] || 'bag', c: '#a98f7a', bg: '#eee4d6' }, images: p.images || [] })
const settingsFromApi = s => ({ businessName: s.businessName || 'Loop & Lane Crochet', whatsapp: s.whatsapp || '', email: s.email || '', phone: s.phone || '' })
const productPayload = (p, includeImages = true) => {
  const data = new FormData()
  data.append('name', p.name)
  data.append('description', p.description || '')
  data.append('price', String(Math.round(Number(p.price))))
  const category = categoryRecords.find(c => c.name === p.category)
  if (!p.category_id && !category) throw new Error('Please select a valid category')
  data.append('category_id', String(p.category_id || category.id))
  data.append('status', p.status || 'available')
  data.append('featured', String(!!p.featured))
  data.append('best', String(!!p.best))
  data.append('specs', JSON.stringify(p.specs || []))
  if (includeImages) (p.newImages || []).forEach(file => data.append('images', file))
  return data
}

export const getProducts = async () => (await request('/products')).map(productFromApi)
export const getCategories = async () => { categoryRecords = await request('/categories'); return categoryRecords.map(c => c.name) }
export const getSettings = async () => settingsFromApi(await request('/settings'))
export const createProduct = async p => productFromApi(await request('/products', { method: 'POST', body: productPayload(p) }))
export const updateProduct = async (id, patch) => productFromApi(await request(`/products/${id}`, { method: 'PUT', body: productPayload(patch) }))
export const deleteProduct = id => request(`/products/${id}`, { method: 'DELETE' })
export const setStatus = async (id, status) => productFromApi(await request(`/products/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }))
export const updateSettings = async s => settingsFromApi(await request('/settings', { method: 'PUT', body: JSON.stringify({ businessName: s.businessName, whatsapp: String(s.whatsapp).replace(/\D/g, ''), email: s.email || '', phone: s.phone || '' }) }))
export const addCategory = async name => { const c = await request('/categories', { method: 'POST', body: JSON.stringify({ name }) }); categoryRecords.push(c); return c }
export const renameCategory = async (oldName, newName) => { const c = categoryRecords.find(x => x.name === oldName); if (!c) throw new Error('Category not found. Refresh and try again.'); const updated = await request(`/categories/${c.id}`, { method: 'PUT', body: JSON.stringify({ name: newName }) }); categoryRecords = categoryRecords.map(x => x.id === c.id ? updated : x); return updated }
export const deleteCategory = async name => { const c = categoryRecords.find(x => x.name === name); if (!c) throw new Error('Category not found. Refresh and try again.'); await request(`/categories/${c.id}`, { method: 'DELETE' }); categoryRecords = categoryRecords.filter(x => x.id !== c.id) }
export const login = async (email, password) => { const result = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); localStorage.setItem(TOKEN_KEY, result.access_token); return result.user }
export const logout = () => localStorage.removeItem(TOKEN_KEY)
export const session = () => token() ? { token: token() } : null
export const me = () => request('/auth/me')
