import {useEffect} from 'react'
import {Outlet,useLocation} from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
export default function SiteLayout(){const{pathname,hash}=useLocation()
useEffect(()=>{if(hash){setTimeout(()=>document.querySelector(hash)?.scrollIntoView({behavior:'smooth'}),60)}else window.scrollTo(0,0)},[pathname,hash])
return <div className="flex min-h-screen flex-col"><Navbar/><main className="flex-1"><Outlet/></main><Footer/></div>}
