import {useState} from 'react'
import {Link,useParams} from 'react-router-dom'
import {MessageCircle} from 'lucide-react'
import Art from '../components/Art'
import ProductCard from '../components/ProductCard'
import {Heading,Loading} from '../components/ui'
import {useStore} from '../context/StoreContext'
import {inr,waLink} from '../utils/format'
import useTitle from '../hooks/useTitle'
const BG=[null,'#f3ece0','#e3e9da','#ece1d1'],LB=['Material','Size','Details','Care']
export default function ProductDetails(){const{id}=useParams(),{products,settings,loading}=useStore(),[i,setI]=useState(0),p=products.find(x=>String(x.id)===id)
useTitle(p?`${p.name} | ${settings.businessName}`:'Product',p?.description)
if(loading)return <Loading/>
if(!p)return <div className="wrap py-24 text-center"><h1 className="text-3xl">We couldn’t find that product</h1><Link to="/shop" className="btn btn-pri mt-6">Back to shop</Link></div>
const sold=p.status==='sold',rel=[...products.filter(x=>x.id!==p.id&&x.category===p.category),...products.filter(x=>x.id!==p.id&&x.category!==p.category)].slice(0,4)
return <div className="wrap py-6 sm:py-10"><p className="mb-5 text-sm text-ink/60"><Link to="/" className="text-coffee">Home</Link> / <Link to="/shop" className="text-coffee">Shop</Link> / {p.name}</p>
<div className="grid gap-6 lg:grid-cols-2 lg:gap-12"><div><div className="relative overflow-hidden rounded-3xl"><Art {...p.art} bg={BG[i]||p.art.bg} k={i} label={p.name} className={`aspect-square ${sold?'saturate-50':''}`}/>{sold&&<span className="absolute left-4 top-4 rounded-full bg-ink px-4 py-1 text-sm font-semibold text-white">SOLD</span>}</div>
<div className="mt-3 grid grid-cols-4 gap-2">{[0,1,2,3].map(k=><button key={k} onClick={()=>setI(k)} aria-label={`Image ${k+1}`} className={`overflow-hidden rounded-xl border-2 ${i===k?'border-coffee':'border-transparent'}`}><Art {...p.art} bg={BG[k]||p.art.bg} k={k} className="aspect-square"/></button>)}</div></div>
<div><span className="tag">{p.category}</span><h1 className="mt-3 text-3xl sm:text-4xl">{p.name}</h1>
<p className="mt-2 flex flex-wrap items-center gap-3"><span className="font-serif text-3xl font-semibold text-coffee">{inr(p.price)}</span><span className={`rounded-full bg-beige px-3 py-0.5 text-xs font-medium ${sold?'text-[#a6544a]':'text-sage'}`}>{sold?'Sold – ask for a remake':'Available'}</span></p>
<p className="mt-3 text-ink/70">{p.description} Each piece is crocheted by hand, so small variations make yours unique.</p>
<dl className="my-5 text-sm">{p.specs.map((s,n)=><div key={n} className="flex gap-4 border-b border-beige py-2.5"><dt className="w-2/5 text-ink/60">{LB[n]}</dt><dd>{s}</dd></div>)}</dl>
<a href={waLink(p,settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-wa sticky bottom-3 w-full py-3.5 shadow-lg lg:static lg:shadow-none"><MessageCircle size={18}/>{sold?'Ask for another one on WhatsApp':'Enquire on WhatsApp'}</a>
<p className="mt-3 text-xs text-ink/60">No cart or online payment. Chat with us, confirm the details, then pay as agreed.</p></div></div>
<section className="py-14"><Heading>You may also love</Heading><div className="grid-p">{rel.map(x=><ProductCard key={x.id} p={x}/>)}</div></section></div>}
