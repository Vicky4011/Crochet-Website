import {createContext,useContext,useEffect,useState,useCallback} from 'react'
import * as api from '../services/api'
const Ctx=createContext()
export const useStore=()=>useContext(Ctx)
export function StoreProvider({children}){
const[products,setP]=useState([]),[categories,setC]=useState([]),[settings,setS]=useState({businessName:'Loop & Lane Crochet',whatsapp:''}),[loading,setL]=useState(true),[error,setE]=useState(''),[toast,setT]=useState(''),[admin,setA]=useState(api.session())
const load=useCallback(async()=>{try{const[p,c,s]=await Promise.all([api.getProducts(),api.getCategories(),api.getSettings()]);setP(p);setC(c);setS(s);setE('')}catch(e){setE(e.message||'Couldn’t load products. Check your connection and try again.')}finally{setL(false)}},[])
useEffect(()=>{load()},[load])
useEffect(()=>{if(!admin)return;let live=true;api.me().then(u=>{if(live)setA(u)}).catch(()=>{api.logout();if(live)setA(null)});return()=>{live=false}},[])
const notify=m=>{setT(m);setTimeout(()=>setT(''),2800)}
const act=(fn,msg)=>async(...a)=>{try{const result=await fn(...a);await load();if(msg)notify(msg);return result}catch(e){notify(e.message);throw e}}
const value={products,categories,settings,loading,error,reload:load,notify,admin,
login:async(e,p)=>{const u=await api.login(e,p);setA(u);return u},logout:()=>{api.logout();setA(null)},
addProduct:act(api.createProduct,'Product added'),updateProduct:act(api.updateProduct,'Product updated'),deleteProduct:act(api.deleteProduct,'Product deleted'),
setStatus:act(api.setStatus),saveSettings:act(api.updateSettings,'Settings saved'),
addCategory:act(api.addCategory,'Category added'),renameCategory:act(api.renameCategory,'Category renamed'),deleteCategory:act(api.deleteCategory,'Category deleted')}
return <Ctx.Provider value={value}>{children}{toast&&<div role="status" className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-white shadow-lg">{toast}</div>}</Ctx.Provider>}
