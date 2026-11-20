import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Heart, Menu, X, ArrowUpRight } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Navbar() {
  const { settings } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const cls = ({ isActive }) =>
    `crochet-nav-link ${isActive ? 'active' : ''}`

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="crochet-header">

      <div className="crochet-header-inner">

        <Link
          to="/"
          className="crochet-brand"
          onClick={closeMenu}
        >
          <span className="crochet-brand-icon">
            <Heart size={19} fill="currentColor" />
          </span>

          <span>
            <strong>
              {settings.businessName || 'Crochet By Balki'}
            </strong>
            <small>HANDMADE WITH LOVE</small>
          </span>
        </Link>

        <nav className={`crochet-nav ${menuOpen ? 'open' : ''}`}>

          <NavLink
            to="/"
            end
            className={cls}
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/shop"
            className={cls}
            onClick={closeMenu}
          >
            Shop
          </NavLink>

          <Link
            to="/#story"
            className="crochet-nav-link"
            onClick={closeMenu}
          >
            Our Story
          </Link>

          <Link
            to="/#footer"
            className="crochet-nav-link"
            onClick={closeMenu}
          >
            Contact
          </Link>

          <Link
            to="/shop"
            className="crochet-nav-cta"
            onClick={closeMenu}
          >
            Explore pieces
            <ArrowUpRight size={15} />
          </Link>

        </nav>

        <button
          className="crochet-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

      </div>

    </header>
  )
}