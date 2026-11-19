import {useState} from 'react'
import {Navigate,useNavigate} from 'react-router-dom'
import {Heart} from 'lucide-react'
import {useStore} from '../../context/StoreContext'
export default function Login(){const{admin,login,settings}=useStore(),nav=useNavigate(),[e,setE]=useState(''),[p,setP]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false)
if(admin)return <Navigate to="/admin" replace/>
const submit=async ev=>{ev.preventDefault();setBusy(true);setErr('');try{await login(e.trim(),p);nav('/admin')}catch(x){setErr(x.message)}finally{setBusy(false)}}
return <div className="grid min-h-screen place-items-center p-4"><form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl bg-card p-8 text-center">
<span className="mx-auto grid size-10 place-items-center rounded-full bg-sage text-white"><Heart size={18} fill="currentColor"/></span>
<h1 className="text-2xl">Admin sign in</h1><p className="text-sm text-ink/60">{settings.businessName}</p>
<input className="input" type="email" placeholder="Email" value={e} onChange={x=>setE(x.target.value)} autoComplete="username" aria-label="Email"/>
<input className="input" type="password" placeholder="Password" value={p} onChange={x=>setP(x.target.value)} autoComplete="current-password" aria-label="Password"/>
{err&&<p role="alert" className="text-sm text-[#a6544a]">{err}</p>}
<button className="btn btn-pri w-full" disabled={busy}>{busy?'Signing in…':'Sign in'}</button></form></div>}
