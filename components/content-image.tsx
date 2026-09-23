'use client';
import {useState} from 'react';
export default function ContentImage({src,alt,className,loading='lazy'}:{src:string;alt:string;className?:string;loading?:'lazy'|'eager'}){
 const [failed,setFailed]=useState(false);
 if(failed)return <span className={className} style={{display:'grid',placeItems:'center',padding:18,background:'#edf1f5',color:'#637287',fontSize:14,textAlign:'center'}}>ছবিটি এখন পাওয়া যাচ্ছে না</span>;
 return <img src={src} alt={alt} className={className} loading={loading} onError={()=>setFailed(true)}/>;
}
