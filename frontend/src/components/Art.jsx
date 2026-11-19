import {art} from '../utils/art'
// Illustrated crochet product art for the demo. Real photos (Cloudinary) replace this in Stage 3.
export default function Art({t,c,bg,k=0,label,className=''}){return <div role="img" aria-label={label||'Crochet product'} className={`art ${className}`} dangerouslySetInnerHTML={{__html:art(t,c,bg,k)}}/>}
export const Defs=()=><svg width="0" height="0" className="absolute" aria-hidden="true"><defs><pattern id="st" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M1.5 1.5l3 4.5 3-4.5" stroke="rgba(255,255,255,.4)" strokeWidth="1.3" fill="none" strokeLinecap="round"/></pattern></defs></svg>
