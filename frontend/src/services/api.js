// Mock data service (localStorage). Stage 3 replaces these with fetch() calls to FastAPI; signatures stay the same.
import seed,{catArt} from '../data/seed'
const K='loop-lane-db',SK='loop-lane-admin'
let db;try{db=JSON.parse(localStorage.getItem(K))}catch{}
db=db||structuredClone(seed)
const run=f=>{const r=f();try{localStorage.setItem(K,JSON.stringify(db))}catch{}return Promise.resolve(r)}
export const getProducts=()=>Promise.resolve([...db.products].sort((a,b)=>b.id-a.id))
export const getCategories=()=>Promise.resolve([...db.categories])
export const getSettings=()=>Promise.resolve({...db.settings})
export const createProduct=p=>run(()=>db.products.push({specs:['Handmade crochet','–','–','–'],featured:false,best:false,status:'available',art:{t:catArt[p.category]||'bag',c:'#a98f7a',bg:'#eee4d6'},...p,id:Date.now()}))
export const updateProduct=(id,patch)=>run(()=>{db.products=db.products.map(p=>p.id===id?{...p,...patch}:p)})
export const deleteProduct=id=>run(()=>{db.products=db.products.filter(p=>p.id!==id)})
export const setStatus=(id,status)=>updateProduct(id,{status})
export const updateSettings=s=>run(()=>{db.settings={...db.settings,...s}})
export const addCategory=n=>run(()=>{if(db.categories.includes(n))throw Error('That category already exists');db.categories.push(n)})
export const renameCategory=(o,n)=>run(()=>{db.categories=db.categories.map(c=>c===o?n:c);db.products=db.products.map(p=>p.category===o?{...p,category:n}:p)})
export const deleteCategory=n=>run(()=>{if(db.products.some(p=>p.category===n))throw Error('Move or delete this category’s products first');db.categories=db.categories.filter(c=>c!==n)})
// Placeholder auth: accepts any non-empty credentials. Real JWT login arrives in Stage 3.
export const login=async(email,pw)=>{if(!email||!pw)throw Error('Enter your email and password');sessionStorage.setItem(SK,email);return{email}}
export const logout=()=>sessionStorage.removeItem(SK)
export const session=()=>{try{const e=sessionStorage.getItem(SK);return e?{email:e}:null}catch{return null}}
