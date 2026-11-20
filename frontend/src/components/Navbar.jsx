import { Link, NavLink } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Navbar() {
  const { settings } = useStore()

  const cls = ({ isActive }) =>
    `transition hover:text-coffee ${isActive ? 'text-coffee' : ''}`

  return (
    <header className="border-b border-beige bg-ivory">
      <div className="wrap flex flex-col items-center gap-3 py-4 sm:flex-row sm:gap-8">

        <Link
          to="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold text-coffee"
        >
          <span className="grid size-7 place-items-center rounded-full bg-sage text-white">
            <Heart size={14} fill="currentColor" />
          </span>

          {settings.businessName || 'Crochet By Balki'}
        </Link>

        <nav className="flex w-full justify-around text-sm font-medium sm:ml-auto sm:w-auto sm:gap-8">

          <NavLink to="/" end className={cls}>
            Home
          </NavLink>

          <NavLink to="/shop" className={cls}>
            Shop
          </NavLink>

          <Link to="/#about" className="transition hover:text-coffee">
            About
          </Link>

          <Link to="/#footer" className="transition hover:text-coffee">
            Contact
          </Link>

        </nav>
      </div>
    </header>
  )
}