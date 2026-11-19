import {NavLink,Navigate,Outlet,useNavigate} from 'react-router-dom'
import {LayoutDashboard,Package,Tags,Settings,LogOut} from 'lucide-react'
import {useStore} from '../context/StoreContext'
const L=[['/admin','Dashboard',LayoutDashboard,true],['/admin/products','Products',Package],['/admin/categories','Categories',Tags],['/admin/settings','Settings',Settings]]
export default function AdminLayout(){const{admin,logout,settings}=useStore(),nav=useNavigate()
if(!admin)return <Navigate to="/admin/login" replace/>
const cls=({isActive})=>`flex flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium sm:flex-none sm:justify-start sm:px-4 sm:text-sm ${isActive?'bg-beige text-coffee':'hover:bg-beige/60'}`
return <div className="min-h-screen sm:grid sm:grid-cols-[220px_minmax(0,1fr)]"><aside className="border-b border-beige bg-card p-2 sm:border-b-0 sm:border-r sm:p-4"><p className="mb-4 hidden px-4 font-serif text-lg font-semibold text-coffee sm:block">{settings.businessName}</p>
<nav className="flex gap-1 sm:flex-col">{L.map(([to,t,I,end])=><NavLink key={to} to={to} end={end} className={cls}><I size={16} className="hidden sm:block"/>{t}</NavLink>)}
<button onClick={()=>{logout();nav('/admin/login')}} className={cls({isActive:false})}><LogOut size={16} className="hidden sm:block"/>Log out</button></nav></aside>
<main className="min-w-0 p-4 pb-10 sm:p-8"><Outlet/></main></div>}
