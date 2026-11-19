import {Link} from 'react-router-dom'
import {MessageCircle} from 'lucide-react'
import Art from './Art'
import {useStore} from '../context/StoreContext'
import {inr,waLink} from '../utils/format'
export default function ProductCard({p}){const{settings}=useStore(),sold=p.status==='sold'
return <article className="group flex flex-col overflow-hidden rounded-2xl bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-coffee/20">
<Link to={`/product/${p.id}`} className="relative block aspect-square overflow-hidden" aria-label={`View ${p.name}`}>
<Art {...p.art} label={p.name} className={`h-full w-full transition duration-500 group-hover:scale-105 ${sold?'saturate-50':''}`}/>
{sold?<span className="absolute left-2 top-2 rounded-full bg-ink px-3 py-0.5 text-xs font-semibold text-white sm:left-3 sm:top-3">SOLD</span>:p.best&&<span className="absolute right-2 top-2 rounded-full bg-sage px-3 py-0.5 text-xs font-semibold text-white sm:right-3 sm:top-3">Best seller</span>}</Link>
<div className="flex flex-1 flex-col items-center gap-1 p-3 text-center sm:p-4">
<h3 className="text-base sm:text-lg"><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
<p className="hidden max-w-[30ch] text-sm text-ink/60 sm:block">{p.description}</p>
<p className="font-semibold text-coffee">{inr(p.price)}<span className={`block text-xs font-medium ${sold?'text-[#a6544a]':'text-sage'}`}>{sold?'Sold – can be remade':'Available'}</span></p>
<a href={waLink(p,settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm mt-auto w-full"><MessageCircle size={15}/>Enquire on WhatsApp</a></div></article>}
