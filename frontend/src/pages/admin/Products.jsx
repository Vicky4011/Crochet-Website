import {useState} from 'react'
import {Plus,ImagePlus} from 'lucide-react'
import ProductRows from '../../components/ProductRows'
import {Modal,Confirm,Loading} from '../../components/ui'
import {useStore} from '../../context/StoreContext'
import useTitle from '../../hooks/useTitle'
function Form({init,categories,onSave,onClose}){const[f,setF]=useState(init),[err,setErr]=useState(''),[imgs,setImgs]=useState([]),set=k=>e=>setF({...f,[k]:e.target.value})
const save=()=>{if(!f.name.trim())return setErr('Enter a product name');if(!(Number(f.price)>0))return setErr('Enter a price above ₹0');onSave({...f,name:f.name.trim(),price:Number(f.price)})}
return <Modal onClose={onClose}><h3 className="text-xl">{init.id?'Edit product':'Add new product'}</h3>
<label className="block text-sm text-ink/70">Name<input className="input mt-1" value={f.name} onChange={set('name')}/></label>
<label className="block text-sm text-ink/70">Price (₹)<input className="input mt-1" type="number" min="1" value={f.price} onChange={set('price')}/></label>
<label className="block text-sm text-ink/70">Category<select className="input mt-1" value={f.category} onChange={set('category')}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
<label className="block text-sm text-ink/70">Description<textarea className="input mt-1" rows="3" value={f.description} onChange={set('description')}/></label>
<label className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed border-beige p-4 text-center text-sm text-ink/60"><ImagePlus size={20}/>{imgs.length?`${imgs.length} image(s) selected`:'Upload images (several allowed)'}<input type="file" accept="image/*" multiple hidden onChange={e=>setImgs([...e.target.files])}/></label>
<p className="text-xs text-ink/50">Image uploads are stored on Cloudinary once the backend is connected (Stage 3).</p>
{err&&<p role="alert" className="text-sm text-[#a6544a]">{err}</p>}
<div className="flex justify-end gap-3"><button className="btn btn-out btn-sm" onClick={onClose}>Cancel</button><button className="btn btn-pri btn-sm" onClick={save}>Save product</button></div></Modal>}
export default function Products(){useTitle('Products | Admin');const s=useStore(),[form,setForm]=useState(null),[del,setDel]=useState(null)
if(s.loading)return <Loading/>
const blank={name:'',price:'',category:s.categories[0]||'',description:''}
const save=async v=>{v.id?await s.updateProduct(v.id,v):await s.addProduct(v);setForm(null)}
return <><div className="mb-5 flex items-center justify-between gap-3"><h1 className="text-2xl sm:text-3xl">Products</h1><button className="btn btn-pri btn-sm" onClick={()=>setForm(blank)}><Plus size={15}/>Add product</button></div>
<ProductRows items={s.products} onEdit={p=>setForm(p)} onDelete={setDel} onToggle={p=>{const n=p.status==='sold'?'available':'sold';s.setStatus(p.id,n);s.notify(n==='sold'?'Marked as sold':'Marked as available')}}/>
{form&&<Form init={form} categories={s.categories} onSave={save} onClose={()=>setForm(null)}/>}
{del&&<Confirm title={`Delete “${del.name}”?`} text="This removes the product from the website. You can’t undo this." yes="Delete product" onNo={()=>setDel(null)} onYes={async()=>{await s.deleteProduct(del.id);setDel(null)}}/>}</>}
