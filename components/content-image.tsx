'use client';
import {useState} from 'react';
import Icon from './admin-icon';
export default function ContentImage({src,alt,className,loading='lazy',compact=false}:{src:string;alt:string;className?:string;loading?:'lazy'|'eager';compact?:boolean}){
 const [failed,setFailed]=useState(false);
 if(failed)return <span className={className} style={{display:'grid',placeItems:'center',padding:compact?6:18,background:'#edf1f5',color:'#637287',fontSize:14,textAlign:'center'}}>{compact?<Icon name="image" size={18}/>:"ছবিটি এখন পাওয়া যাচ্ছে না"}</span>;
 return <img src={src} alt={alt} className={className} loading={loading} onError={()=>setFailed(true)}/>;
}
