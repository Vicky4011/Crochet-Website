import {MessageCircle} from 'lucide-react'
import {useStore} from '../context/StoreContext'
export default function Footer(){const{settings:s}=useStore()
return <footer className="bg-coffee text-white"><div className="wrap flex flex-col items-center gap-8 py-10 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
<div><p className="font-serif text-xl font-semibold">{s.businessName}</p><p className="mt-2 text-sm text-white/80">Handmade crochet from Chennai, made to order.</p></div>
<div className="text-sm text-white/80"><p className="font-serif text-lg font-semibold text-white">Contact</p><p className="mt-2">{s.email}</p><p>{s.phone}</p></div>
<a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><MessageCircle size={16}/>Order on WhatsApp</a></div></footer>}
