import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'

import ProductCard from '../components/ProductCard'
import { Loading, ErrorBox } from '../components/ui'
import { useStore } from '../context/StoreContext'
import useTitle from '../hooks/useTitle'

export default function Shop() {
  const {
    products,
    categories,
    loading,
    error,
    reload
  } = useStore()

  const [sp, setSp] = useSearchParams()

  const [q, setQ] = useState('')
  const [sort, setSort] = useState('new')
  const [status, setStatus] = useState('')

  const category = sp.get('cat') || ''

  useTitle(
    'Shop the collection | Crochet By Balki',
    'Explore handmade crochet bags, flowers, toys and gifts.'
  )

  const list = useMemo(() => {
    return products
      .filter(product =>
        !q ||
        `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(q.toLowerCase())
      )
      .filter(product =>
        !category || product.category === category
      )
      .filter(product =>
        !status || product.status === status
      )
      .sort((a, b) => {
        if (sort === 'low') return a.price - b.price
        if (sort === 'high') return b.price - a.price
        return b.id - a.id
      })
  }, [products, q, category, status, sort])

  return (
    <main className="shop-page">

      <div className="shop-container">

        {/* PAGE HEADING */}

        <section className="shop-heading">

          <span className="shop-kicker">
            Handmade with love
          </span>

          <h1>The collection</h1>

          <div className="shop-divider" />

          <p>
            {list.length} {list.length === 1 ? 'piece' : 'pieces'}
          </p>

        </section>


        {/* FILTERS */}

        <section className="shop-filters">

          <label className="shop-search">

            <Search size={18} />

            <input
              type="search"
              placeholder="Search bags, flowers, toys..."
              value={q}
              onChange={e => setQ(e.target.value)}
              aria-label="Search products"
            />

          </label>


          <select
            value={category}
            onChange={e =>
              setSp(
                e.target.value
                  ? { cat: e.target.value }
                  : {}
              )
            }
            aria-label="Filter by category"
          >

            <option value="">All categories</option>

            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}

          </select>


          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            aria-label="Sort products"
          >

            <option value="new">Newest first</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>

          </select>


          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            aria-label="Filter availability"
          >

            <option value="">Available & sold</option>
            <option value="available">Available only</option>
            <option value="sold">Sold only</option>

          </select>

        </section>


        {/* PRODUCTS */}

        {loading ? (

          <Loading />

        ) : error ? (

          <ErrorBox
            msg={error}
            retry={reload}
          />

        ) : list.length ? (

          <section className="shop-product-grid">

            {list.map(product => (
              <ProductCard
                key={product.id}
                p={product}
              />
            ))}

          </section>

        ) : (

          <div className="shop-empty">

            <span>🌸</span>

            <h2>No pieces found</h2>

            <p>
              Try another search or choose a different category.
            </p>

            <button
              onClick={() => {
                setQ('')
                setStatus('')
                setSort('new')
                setSp({})
              }}
            >
              Clear filters
            </button>

          </div>

        )}

      </div>

    </main>
  )
}