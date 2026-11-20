import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from 'react'

import * as api from '../services/api'

const Ctx = createContext()

export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }) {
  const [products, setP] = useState([])
  const [categories, setC] = useState([])

  const [settings, setS] = useState({
    businessName: 'Loop & Lane Crochet',
    whatsapp: ''
  })

  const [loading, setL] = useState(true)
  const [booting, setBooting] = useState(true)
  const [error, setE] = useState('')
  const [toast, setT] = useState('')

  const [admin, setA] = useState(api.session())

  const load = useCallback(async () => {
    try {
      const [p, c, s] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getSettings()
      ])

      setP(p)
      setC(c)
      setS(s)
      setE('')
    } catch (e) {
      setE(
        e.message ||
        'Could not load website data. Please try again.'
      )
    } finally {
      setL(false)
      setBooting(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!admin) return

    let live = true

    api.me()
      .then(u => {
        if (live) setA(u)
      })
      .catch(() => {
        api.logout()

        if (live) setA(null)
      })

    return () => {
      live = false
    }
  }, [])

  const notify = m => {
    setT(m)
    setTimeout(() => setT(''), 2800)
  }

  const act = (fn, msg) => async (...a) => {
    try {
      const result = await fn(...a)

      await load()

      if (msg) notify(msg)

      return result
    } catch (e) {
      notify(e.message)
      throw e
    }
  }

  const value = {
    products,
    categories,
    settings,
    loading,
    error,
    reload: load,
    notify,
    admin,

    login: async (e, p) => {
      const u = await api.login(e, p)
      setA(u)
      return u
    },

    logout: () => {
      api.logout()
      setA(null)
    },

    addProduct: act(api.createProduct, 'Product added'),
    updateProduct: act(api.updateProduct, 'Product updated'),
    deleteProduct: act(api.deleteProduct, 'Product deleted'),

    setStatus: act(api.setStatus),

    saveSettings: act(api.updateSettings, 'Settings saved'),

    addCategory: act(api.addCategory, 'Category added'),
    renameCategory: act(api.renameCategory, 'Category renamed'),
    deleteCategory: act(api.deleteCategory, 'Category deleted')
  }

  return (
    <Ctx.Provider value={value}>
      {booting ? (
        <div className="min-h-screen grid place-items-center bg-[#faf7f0]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-[#806052] border-t-transparent" />

            <p className="font-serif text-xl text-[#806052]">
              Loading...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="min-h-screen grid place-items-center bg-[#faf7f0] p-6">
          <div className="max-w-sm text-center">
            <h2 className="font-serif text-2xl text-[#806052]">
              Unable to load the website
            </h2>

            <p className="mt-3 text-sm text-gray-600">
              {error}
            </p>

            <button
              onClick={() => {
                setBooting(true)
                setL(true)
                load()
              }}
              className="mt-6 rounded-full bg-[#806052] px-6 py-3 text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        children
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </Ctx.Provider>
  )
}