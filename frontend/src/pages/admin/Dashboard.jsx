import {useStore} from '../../context/StoreContext'
import ProductRows from '../../components/ProductRows'
import {Loading} from '../../components/ui'
import useTitle from '../../hooks/useTitle'
export default function Dashboard(){useTitle('Dashboard | Admin');const{products,loading}=useStore(),av=products.filter(p=>p.status==='available').length
const K=[['Total products',products.length],['Available',av],['Sold',products.length-av],['On homepage',products.filter(p=>p.featured).length]]
if(loading)return <Loading/>
return <><h1 className="mb-5 text-2xl sm:text-3xl">Dashboard</h1><div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">{K.map(([l,n])=><div key={l} className="rounded-2xl bg-card p-4"><p className="font-serif text-3xl font-semibold text-coffee">{n}</p><p className="text-sm text-ink/60">{l}</p></div>)}</div>
<h2 className="mb-3 text-xl">Recently added</h2><ProductRows items={products.slice(0,4)}/></>}
