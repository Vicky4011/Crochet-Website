import {useMemo,useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import {Search} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import {Heading,Loading,ErrorBox} from '../components/ui'
import {useStore} from '../context/StoreContext'
import useTitle from '../hooks/useTitle'
export default function Shop(){useTitle('Shop the collection | Loop & Lane Crochet','Browse handmade crochet bags, flowers, toys, keychains, home decor and gifts.')
const{products,categories,loading,error,reload}=useStore(),[sp,setSp]=useSearchParams(),[q,setQ]=useState(''),[sort,setSort]=useState('new'),[st,setSt]=useState(''),cat=sp.get('cat')||''
const list=useMemo(()=>products.filter(p=>(!q||`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q.toLowerCase()))&&(!cat||p.category===cat)&&(!st||p.status===st)).sort((a,b)=>sort==='lo'?a.price-b.price:sort==='hi'?b.price-a.price:b.id-a.id),[products,q,cat,st,sort])
return <div className="wrap py-10"><Heading sub={loading?'':`${list.length} piece${list.length===1?'':'s'}`}>The collection</Heading>
<div className="mb-8 grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-[2fr_1fr_1fr_1fr]">
<label className="relative col-span-3 md:col-span-1"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"/><input className="input pl-10" placeholder="Search bags, flowers, toys…" value={q} onChange={e=>setQ(e.target.value)} aria-label="Search products"/></label>
<select className="input" value={cat} onChange={e=>setSp(e.target.value?{cat:e.target.value}:{})} aria-label="Category"><option value="">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select>
<select className="input" value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort"><option value="new">Newest first</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option></select>
<select className="input" value={st} onChange={e=>setSt(e.target.value)} aria-label="Availability"><option value="">Available &amp; sold</option><option value="available">Available only</option><option value="sold">Sold only</option></select></div>
{loading?<Loading/>:error?<ErrorBox msg={error} retry={reload}/>:list.length?<div className="grid-p">{list.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<p className="py-16 text-center text-ink/60">Nothing matches yet. Try another category or clear the search.</p>}</div>}
