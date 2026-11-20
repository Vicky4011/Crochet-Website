import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Heart,
  Flower2,
  Gift,
  Sparkles,
  Instagram
} from 'lucide-react'

import Art from '../components/Art'
import ProductCard from '../components/ProductCard'
import { Loading, ErrorBox } from '../components/ui'
import { useStore } from '../context/StoreContext'
import { catArt } from '../data/seed'
import useTitle from '../hooks/useTitle'

const WHY = [
  {
    icon: Heart,
    title: 'Made with love',
    text: 'Every piece is carefully handmade with patience and attention to detail.'
  },
  {
    icon: Sparkles,
    title: 'One of a kind',
    text: 'Every creation has its own personality and handmade charm.'
  },
  {
    icon: Flower2,
    title: 'Thoughtful details',
    text: 'Beautiful colours, soft yarn and carefully finished stitches.'
  },
  {
    icon: Gift,
    title: 'Perfect for gifting',
    text: 'Special handmade gifts for the people who matter most.'
  }
]

const TST = [
  [
    'The tote is stunning and sturdier than any bag I have bought in a mall.',
    'Ananya, Bengaluru'
  ],
  [
    'Biscuit the bunny is my daughter’s new best friend.',
    'Priya, Chennai'
  ],
  [
    'Ordering was so easy, and she remade my sold-out favourite.',
    'Kavya, Hyderabad'
  ]
]

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
    `${settings.businessName || 'Crochet By Balki'} | Handmade with love`,
    'Discover beautiful handmade crochet bags, flowers, toys and gifts.'
  )

  const featured = products
    .filter(product => product.featured)
    .slice(0, 4)

  const heroImage =
    settings.homepageImageUrl ||
    products.find(product => product.images?.length)?.images?.[0]?.url

  const aboutImage =
    settings.aboutImageUrl ||
    products.find(product => product.images?.length)?.images?.[0]?.url

  return (
    <div className="crochet-home">

      {/* HERO */}

      <section className="crochet-hero" id="home">
        <div className="crochet-hero-inner">

          <div className="crochet-hero-copy">

            <span className="crochet-kicker">
              Little things, lovingly made
            </span>

            <h1>
              Made by hand.
              <br />
              <em>Made to be loved.</em>
            </h1>

            <p>
              Thoughtful crochet creations, stitched slowly
              and made with lots of love. Find a little piece
              of handmade joy for yourself or someone special.
            </p>

            <div className="crochet-actions">
              <Link to="/shop" className="crochet-primary">
                Shop the collection
                <ArrowRight size={16} />
              </Link>

              <a href="#story" className="crochet-secondary">
                Our story
              </a>
            </div>

          </div>

          <div className="crochet-hero-visual">

            <span className="crochet-flower flower-one">✿</span>

            <div className="crochet-hero-frame">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Handmade crochet creation"
                />
              ) : (
                <div className="crochet-placeholder">
                  🧶🌸
                </div>
              )}
            </div>

            <span className="crochet-floating-note note-one">
              Stitched with ♡
            </span>

            <span className="crochet-floating-note note-two">
              One of a kind
            </span>

            <span className="crochet-flower flower-two">✽</span>

          </div>

        </div>
      </section>


      {/* TRUST STRIP */}

      <section className="crochet-trust">
        <span>Made with love</span>
        <span>Thoughtful details</span>
        <span>Made just for you</span>
      </section>


      {/* CATEGORIES */}

      <section className="crochet-section crochet-categories">

        <div className="crochet-section-heading">
          <span>A little something for everyone</span>
          <h2>Explore our categories</h2>
          <p>
            Find the kind of handmade joy you're looking for.
          </p>
        </div>

        <div className="crochet-category-grid">

          {categories.map((category, index) => {

            const decorations = [
              '👜',
              '🌷',
              '🧸',
              '🌼',
              '🪴',
              '🎀',
              '💝'
            ]

            return (
              <Link
                key={category}
                to={`/shop?cat=${encodeURIComponent(category)}`}
                className={`crochet-category-card category-${index % 4}`}
              >

                <span className="category-decoration">
                  {decorations[index % decorations.length]}
                </span>

                <div className="category-art">
                  <Art
                    t={catArt[category] || 'bag'}
                    c="#89977b"
                    bg="#f3e9da"
                    label={category}
                    className="size-full"
                  />
                </div>

                <div className="category-title">
                  {category}
                  <small>Explore collection ↗</small>
                </div>

              </Link>
            )
          })}

        </div>

      </section>


      {/* FEATURED PRODUCTS */}

      <section className="crochet-featured">

        <div className="crochet-section">

          <div className="crochet-section-heading">
            <span>Picked with love</span>
            <h2>Featured pieces</h2>
            <p>
              A few favourites from our crochet corner.
            </p>
          </div>

          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorBox msg={error} retry={reload} />
          ) : featured.length ? (
            <div className="grid-p">
              {featured.map(product => (
                <ProductCard
                  key={product.id}
                  p={product}
                />
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-ink/60">
              Our featured collection is coming soon.
            </p>
          )}

          <div className="text-center mt-10">
            <Link to="/shop" className="crochet-secondary">
              View all pieces
              <ArrowRight size={15} />
            </Link>
          </div>

        </div>

      </section>


      {/* OUR STORY */}

      <section className="crochet-story" id="story">

        <div className="crochet-story-inner">

          <div className="crochet-story-image">

            {aboutImage ? (
              <img
                src={aboutImage}
                alt="Our handmade crochet work"
              />
            ) : (
              <div className="crochet-placeholder">
                🧶🌸
              </div>
            )}

          </div>

          <div className="crochet-story-content">

            <span className="crochet-kicker">
              A little about us
            </span>

            <h2>
              Every stitch tells a story.
            </h2>

            <p>
              Welcome to our little crochet corner!
              Each piece is thoughtfully handmade,
              one loop at a time.
            </p>

            <p>
              We believe the best gifts carry a little
              warmth, a little personality and a whole
              lot of love.
            </p>

            <div className="crochet-signature">
              With love, Balki ♡
            </div>

            <Link to="/shop" className="crochet-primary">
              Meet the collection
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      </section>


      {/* WHY CHOOSE HANDMADE */}

      <section className="crochet-section">

        <div className="crochet-section-heading">
          <span>The handmade difference</span>
          <h2>Why choose handmade?</h2>
          <p>
            Little details make every piece feel extra special.
          </p>
        </div>

        <div className="crochet-why-grid">

          {WHY.map(({ icon: Icon, title, text }) => (
            <article className="crochet-why-card" key={title}>

              <div className="why-icon">
                <Icon size={25} />
              </div>

              <h3>{title}</h3>

              <p>{text}</p>

            </article>
          ))}

        </div>

      </section>


      {/* KIND WORDS */}

      <section className="crochet-testimonials">

        <div className="crochet-section-heading">
          <span>A little love from our customers</span>
          <h2>Kind words</h2>
        </div>

        <div className="crochet-testimonial-grid">

          {TST.map(([quote, name]) => (
            <article
              className="crochet-testimonial"
              key={name}
            >

              <div className="testimonial-stars">
                ★★★★★
              </div>

              <blockquote>
                “{quote}”
              </blockquote>

              <span>{name}</span>

            </article>
          ))}

        </div>

      </section>

    </div>
  )
}