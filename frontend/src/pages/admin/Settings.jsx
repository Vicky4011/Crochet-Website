import {useState} from 'react'
import {useStore} from '../../context/StoreContext'
import {Loading} from '../../components/ui'
import useTitle from '../../hooks/useTitle'
export default function Settings(){useTitle('Settings | Admin');const s=useStore(),[f,setF]=useState(null),v=f||s.settings,set=k=>e=>setF({...v,[k]:e.target.value})
if(s.loading)return <Loading/>
const save=()=>{const n=String(v.whatsapp).replace(/\D/g,'');if(n.length<10)return s.notify('Enter the WhatsApp number with country code, digits only');s.saveSettings({...v,whatsapp:n});setF(null)}
const F=[['businessName','Business name'],['whatsapp','WhatsApp number (with country code, e.g. 919876543210)'],['email','Contact email'],['phone','Contact phone']]
return <><h1 className="mb-5 text-2xl sm:text-3xl">Settings</h1><div className="max-w-lg space-y-4">
{F.map(([k,l])=><label key={k} className="block text-sm text-ink/70">{l}<input className="input mt-1" value={v[k]||''} onChange={set(k)}/></label>)}
<button className="btn btn-pri" onClick={save}>Save settings</button>
<div className="pt-4"><h2 className="mb-2 text-xl">Homepage featured products</h2><div className="space-y-2">{s.products.map(p=><label key={p.id} className="flex items-center gap-3 rounded-xl bg-card px-4 py-2.5 text-sm"><input type="checkbox" className="size-4 accent-[#795548]" checked={p.featured} onChange={e=>s.updateProduct(p.id,{featured:e.target.checked})}/>{p.name}</label>)}</div></div></div></>}
