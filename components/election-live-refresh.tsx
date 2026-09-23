'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function ElectionLiveRefresh({seconds=15}:{seconds?:number}){
  const router=useRouter();
  useEffect(()=>{
    const timer=window.setInterval(()=>router.refresh(),Math.max(5,seconds)*1000);
    return()=>window.clearInterval(timer);
  },[router,seconds]);
  return null;
}
