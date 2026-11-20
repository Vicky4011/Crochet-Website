import { Link } from 'react-router-dom'
import Art from '../components/Art'
import ProductCard from '../components/ProductCard'
import { Heading, Loading, ErrorBox } from '../components/ui'
import { useStore } from '../context/StoreContext'
import { catArt } from '../data/seed'
import useTitle from '../hooks/useTitle'

const WHY = [
  [
    'Made to last',
    'Dense stitches and quality cotton hold shape wash after wash.'
  ],
  [
    'One of a kind',
    'No two pieces are identical, and colours can be customised.'
  ],
  [
    'Gentle on skin',
    'Soft, baby-safe yarns for toys and accessories.'
  ],
  [
    'Small and personal',
    'You chat directly with the maker, not a call centre.'
  ]
]

const TST = [
  [
    'The tote is stunning and sturdier than any bag I’ve bought in a mall.',
    'Ananya, Bengaluru'
  ],
  [
    'Biscuit the bunny is my daughter’s new best friend.',
    'Priya, Chennai'
  ],
  [
    'Ordering on WhatsApp was so easy, and she remade my sold-out favourite.',
    'Kavya, Hyderabad'
  ]
]

const lift =
  'transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-coffee/20'

// Get the main image of a product.
function getProductImage(product) {
  if (!product?.images?.length) return null

  const primary =
    product.images.find(image => image.is_primary) ||
    product.images[0]

  return primary?.url || null
}

// Find a fallback product image.
function getFallbackImage(products, preferredCategory) {
  const preferred = products.find(
    product =>
      product.art?.t === preferredCategory &&
      getProductImage(product)
  )

  if (preferred) return getProductImage(preferred)

  const firstProduct = products.find(
    product => getProductImage(product)
  )

  return getProductImage(firstProduct)
}

export default function Home() {
  const {
    products,
    categories,
    settings,
    loading,
    error,
    reload
  } = useStore()

  useTitle(
    `${settings.businessName || 'Loop & Lane Crochet'} | Handmade crochet`,
    'Handmade crochet bags, flowers, toys and gifts. Browse and order on WhatsApp.'
  )

  const feat = products.filter(product => product.featured)

  const best = products
    .filter(product => product.best)
    .slice(0, 4)

  const A = products

  // --------------------------------------
  // Homepage image selection
  // --------------------------------------

  const heroImage =
    settings.homepageImageUrl ||
    getFallbackImage(A, 'bag')

  // --------------------------------------
  // About image selection
  // --------------------------------------

  const aboutImage =
    settings.aboutImageUrl ||
    getFallbackImage(A, 'bunny')

  return (
    <>
      {/* ---------------------------------- */}
      {/* Hero section */}
      {/* ---------------------------------- */}

      <section className="wrap grid items-center gap-8 py-10 text-center lg:grid-cols-2 lg:gap-12 lg:py-16 lg:text-left">

        <div>
          <span className="tag">
            Small-batch crochet · Made in Chennai
          </span>

          <h1 className="mt-4 text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Handmade with Love, Crafted to Last.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-ink/70 lg:mx-0">
            Bags, blooms, toys and keepsakes, each stitched by hand.
            Pick a piece, then chat with us on WhatsApp to order.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">

            <Link to="/shop" className="btn btn-pri">
              Shop collection
            </Link>

            <a
              className="btn btn-out"
              href={`https://wa.me/${settings.whatsapp || ''}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order on WhatsApp
            </a>

          </div>
        </div>

        {/* Admin-selected homepage image */}

        <div className="overflow-hidden rounded-2xl sm:rounded-3xl">

          {heroImage ? (
            <img
              src={heroImage}
              alt="Handmade crochet collection"
              className="aspect-square w-full object-cover transition duration-700 hover:scale-105"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-beige p-6 text-center text-sm text-ink/50">
              Product images will appear here once uploaded.
            </div>
          )}

        </div>

      </section>

      {/* ---------------------------------- */}
      {/* Categories */}
      {/* ---------------------------------- */}

      <section className="wrap pb-10">

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-7 lg:px-0">

          {categories.map(category => (
            <Link
              key={category}
              to={`/shop?cat=${encodeURIComponent(category)}`}
              className="w-24 shrink-0 rounded-2xl bg-beige p-3 text-center text-xs font-medium transition hover:bg-sage hover:text-white lg:w-auto"
            >

              <Art
                t={catArt[category] || 'bag'}
                c="#89977b"
                bg="#f3e9da"
                label={category}
                className="mx-auto mb-2 size-12 overflow-hidden rounded-full"
              />

              {category}

            </Link>
          ))}

        </div>

      </section>

      {/* ---------------------------------- */}
      {/* Featured products */}
      {/* ---------------------------------- */}

      <section className="wrap py-10">

        <Heading>
          Featured pieces
        </Heading>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorBox
            msg={error}
            retry={reload}
          />
        ) : (
          <div className="grid-p">
            {feat.map(product => (
              <ProductCard
                key={product.id}
                p={product}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">

          <Link to="/shop" className="btn btn-out">
            View all products
          </Link>

        </div>

      </section>

      {/* ---------------------------------- */}
      {/* Best sellers */}
      {/* ---------------------------------- */}

      <section className="wrap py-10">
  <Heading>Featured pieces</Heading>

  {loading ? (
    <Loading />
  ) : error ? (
    <ErrorBox msg={error} retry={reload} />
  ) : (
    <div className="grid-p">
      {feat.map(p => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  )}

  <div className="mt-8 text-center">
    <Link to="/shop" className="btn btn-out">
      View all products
    </Link>
  </div>
</section>

      {/* ---------------------------------- */}
      {/* About section */}
      {/* ---------------------------------- */}

      <section
        id="about"
        className="wrap grid items-center gap-8 py-14 text-center lg:grid-cols-2 lg:gap-12 lg:text-left"
      >

        <div className="overflow-hidden rounded-3xl">

          {aboutImage ? (
            <img
              src={aboutImage}
              alt="Handmade crochet work"
              className="aspect-[5/4] w-full object-cover transition duration-700 hover:scale-105"
            />
          ) : (
            <div className="flex aspect-[5/4] items-center justify-center bg-beige p-6 text-sm text-ink/50">
              Upload product images to display them here.
            </div>
          )}

        </div>

        <div>

          <span className="tag">
            Our story
          </span>

          <h2 className="mt-4 text-3xl">
            One hook, one skein, one piece at a time
          </h2>

          <p className="mt-3 text-ink/70">
            It began at a kitchen table with a ball of cotton yarn.
            Today every item is still crocheted by hand, checked
            stitch by stitch, and packed with a thank-you note.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
  <Link
    to="/shop"
    className="btn btn-pri"
  >
    Meet the collection
  </Link>

  <a
    href="https://www.instagram.com/crochet._.by._.balki/"
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-out"
  >
    Follow us on Instagram ↗
  </a>
</div>

        </div>

      </section>

      {/* ---------------------------------- */}
      {/* Why choose handmade */}
      {/* ---------------------------------- */}

      <section className="wrap pb-14">

        <Heading>
          Why choose handmade
        </Heading>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">

          {WHY.map(([title, description]) => (
            <div
              key={title}
              className={`rounded-2xl bg-beige p-4 text-center sm:p-6 ${lift} hover:bg-sage/25`}
            >

              <span className="mx-auto mb-3 block size-10 rounded-full bg-sage ring-4 ring-inset ring-beige" />

              <h3 className="text-base sm:text-lg">
                {title}
              </h3>

              <p className="mt-1 text-xs text-ink/70 sm:text-sm">
                {description}
              </p>

            </div>
          ))}

        </div>

      </section>

      {/* ---------------------------------- */}
      {/* Testimonials */}
      {/* ---------------------------------- */}

      <section className="bg-beige py-14">

        <div className="wrap">

          <Heading>
            Kind words
          </Heading>

          <div className="grid gap-4 md:grid-cols-3">

            {TST.map(([quote, name]) => (
              <figure
                key={name}
                className={`rounded-2xl bg-card p-6 text-center ${lift}`}
              >

                <p className="text-sage" aria-label="5 stars">
                  ★★★★★
                </p>

                <blockquote className="my-3 font-serif text-lg">
                  “{quote}”
                </blockquote>

                <figcaption className="text-sm text-ink/60">
                  {name}
                </figcaption>

              </figure>
            ))}

          </div>

        </div>

      </section>

      {/* ---------------------------------- */}
      {/* Instagram / Follow along */}
      {/* ---------------------------------- */}

      <section className="wrap py-14">

        <Heading>
          Follow along
        </Heading>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">

          {A.slice(0, 6).map((product, index) => (
            <Art
              key={product.id}
              {...product.art}
              images={product.images}
              k={index % 3 + 1}
              label={product.name}
              className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl"
            />
          ))}

        </div>

      </section>

    </>
  )
}