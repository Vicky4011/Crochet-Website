import {Routes,Route,Link} from 'react-router-dom'
import {Defs} from './components/Art'
import SiteLayout from './layouts/SiteLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Categories from './pages/admin/Categories'
import Settings from './pages/admin/Settings'
const NotFound=()=><div className="wrap py-24 text-center"><h1 className="text-4xl">Page not found</h1><p className="mt-3 text-ink/60">That page doesn’t exist.</p><Link to="/" className="btn btn-pri mt-6">Back to home</Link></div>
export default function App(){return <><Defs/><Routes>
<Route element={<SiteLayout/>}><Route index element={<Home/>}/><Route path="shop" element={<Shop/>}/><Route path="product/:id" element={<ProductDetails/>}/></Route>
<Route path="admin/login" element={<Login/>}/>
<Route path="admin" element={<AdminLayout/>}><Route index element={<Dashboard/>}/><Route path="products" element={<Products/>}/><Route path="categories" element={<Categories/>}/><Route path="settings" element={<Settings/>}/></Route>
<Route path="*" element={<NotFound/>}/></Routes></>}
