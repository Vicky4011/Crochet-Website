import { Instagram, MessageCircle, Mail, Phone } from 'lucide-react'
import { useStore } from '../context/StoreContext'

const INSTAGRAM_URL =
  'https://www.instagram.com/crochet._.by._.balki/'

export default function Footer() {
  const { settings: s } = useStore()

  // Convert WhatsApp number into digits only
  const whatsappNumber = String(s.whatsapp || '').replace(/\D/g, '')

  return (
    <footer id="footer" className="crochet-footer">
      <div className="crochet-footer-inner">

        {/* Business information */}
        <div className="footer-business">
          <div className="footer-logo">
            <span>✿</span>
            {s.businessName || 'Crochet By Balki'}
          </div>

          <p>
            Handmade treasures, created with care
            and a little extra love.
          </p>

          <div className="footer-made">
            Made with ♡ and lots of love.
          </div>
        </div>

        {/* Contact information */}
        <div className="footer-column">
          <h3>Say hello</h3>

          {s.email && (
            <a href={`mailto:${s.email}`}>
              <Mail size={15} />
              {s.email}
            </a>
          )}

          {s.phone && (
            <a href={`tel:${s.phone}`}>
              <Phone size={15} />
              {s.phone}
            </a>
          )}

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={15} />
            @crochet._.by._.balki
          </a>

          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={15} />
              WhatsApp: {s.whatsapp}
            </a>
          )}
        </div>

      </div>

      <div className="crochet-footer-bottom">
        <span>
          © {new Date().getFullYear()} {s.businessName || 'Crochet By Balki'}
        </span>

        <span>
          MADE WITH LOVE, ONE STITCH AT A TIME ✿
        </span>
      </div>
    </footer>
  )
}