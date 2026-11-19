import Art from './Art'
import {Status} from './ui'
import {inr} from '../utils/format'
export default function ProductRows({items,onEdit,onDelete,onToggle}){
if(!items.length)return <p className="rounded-2xl bg-card p-6 text-center text-sm text-ink/60">No products yet. Add your first one to see it here.</p>
return <div className="space-y-3">{items.map(p=><div key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-card p-3">
<Art {...p.art} images={p.images} label={p.name} className="size-12 shrink-0 overflow-hidden rounded-xl"/>
<div className="min-w-0 flex-1 basis-40"><p className="truncate font-medium">{p.name}</p><p className="text-xs text-ink/60">{p.category}</p></div>
<p className="font-semibold text-coffee">{inr(p.price)}</p>
{onToggle?<button onClick={()=>onToggle(p)} title="Click to change status"><Status sold={p.status==='sold'}/></button>:<Status sold={p.status==='sold'}/>}
{onEdit&&<div className="ml-auto flex gap-2"><button className="btn btn-out btn-sm" onClick={()=>onEdit(p)}>Edit</button><button className="btn btn-out btn-sm" onClick={()=>onDelete(p)}>Delete</button></div>}</div>)}</div>}
