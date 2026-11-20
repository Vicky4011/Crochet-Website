import { MessageCircle, Instagram } from 'lucide-react'
import { useStore } from '../context/StoreContext'

const INSTAGRAM_URL =
  'https://www.instagram.com/crochet._.by._.balki/'

export default function Footer() {
  const { settings: s } = useStore()

  return (
    <footer
      id="footer"
      className="scroll-mt-6 bg-coffee text-white"
    >
      <div className="wrap flex flex-col items-center gap-8 py-10 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">

        {/* Business information */}
        <div>
          <p className="font-serif text-xl font-semibold">
            {s.businessName || 'Crochet By Balki'}
          </p>

          <p className="mt-2 text-sm text-white/80">
            Handmade crochet from Chennai, made to order.
          </p>
        </div>

        {/* Contact information */}
        <div className="text-sm text-white/80">
          <p className="font-serif text-lg font-semibold text-white">
            Contact
          </p>

          <p className="mt-2">{s.email}</p>
          <p>{s.phone}</p>
        </div>

        {/* Instagram */}
        <div>
          <p className="mb-3 font-serif text-lg font-semibold">
            Follow Us
          </p>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/90 transition hover:text-white hover:underline"
          >
            <Instagram size={19} />
            @crochet._.by._.balki
          </a>
        </div>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${s.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa"
        >
          <MessageCircle size={16} />
          Order on WhatsApp
        </a>

      </div>
    </footer>
  )
}