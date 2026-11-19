import {useState} from 'react'
import {Plus} from 'lucide-react'
import {Modal,Confirm,Loading} from '../../components/ui'
import {useStore} from '../../context/StoreContext'
import useTitle from '../../hooks/useTitle'
export default function Categories(){useTitle('Categories | Admin');const s=useStore(),[ed,setEd]=useState(null),[del,setDel]=useState(null)
if(s.loading)return <Loading/>
const run=async fn=>{try{await fn();setEd(null);setDel(null)}catch(e){s.notify(e.message)}}
const save=()=>{const v=ed.val.trim();if(!v)return s.notify('Enter a category name');run(()=>ed.old?s.renameCategory(ed.old,v):s.addCategory(v))}
return <><div className="mb-5 flex items-center justify-between gap-3"><h1 className="text-2xl sm:text-3xl">Categories</h1><button className="btn btn-pri btn-sm" onClick={()=>setEd({old:null,val:''})}><Plus size={15}/>Add category</button></div>
<div className="space-y-3">{s.categories.map(c=><div key={c} className="flex items-center gap-3 rounded-2xl bg-card p-3 pl-4"><div className="flex-1"><p className="font-medium">{c}</p><p className="text-xs text-ink/60">{s.products.filter(p=>p.category===c).length} products</p></div>
<button className="btn btn-out btn-sm" onClick={()=>setEd({old:c,val:c})}>Rename</button><button className="btn btn-out btn-sm" onClick={()=>setDel(c)}>Delete</button></div>)}</div>
{ed&&<Modal onClose={()=>setEd(null)}><h3 className="text-xl">{ed.old?'Rename category':'Add category'}</h3><input className="input" autoFocus value={ed.val} onChange={e=>setEd({...ed,val:e.target.value})} aria-label="Category name"/><div className="flex justify-end gap-3"><button className="btn btn-out btn-sm" onClick={()=>setEd(null)}>Cancel</button><button className="btn btn-pri btn-sm" onClick={save}>Save category</button></div></Modal>}
{del&&<Confirm title={`Delete “${del}”?`} text="Categories with products can’t be deleted." yes="Delete category" onNo={()=>setDel(null)} onYes={()=>run(()=>s.deleteCategory(del))}/>}</>}
