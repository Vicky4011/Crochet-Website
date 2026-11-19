import {useEffect} from 'react'
export default function useTitle(t,d){useEffect(()=>{document.title=t;if(d){const m=document.querySelector('meta[name=description]');m&&m.setAttribute('content',d)}},[t,d])}
