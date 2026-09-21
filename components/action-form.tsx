'use client';
import {useActionState,useState} from 'react';
import Submit from './submit';

export type FormState={error?:string;success?:string};

export default function ActionForm({action,children,label}:{action:(state:FormState,data:FormData)=>Promise<FormState>;children:React.ReactNode;label?:string}){
  const [state,formAction]=useActionState(action,{});
  const [copied,setCopied]=useState(false);
  const copyValue=state.success?.includes(': ')?state.success.split(': ').slice(1).join(': ').trim():'';

  async function copyResult(){
    if(!copyValue)return;
    try{await navigator.clipboard.writeText(copyValue);setCopied(true);setTimeout(()=>setCopied(false),1800);}catch{/* Clipboard may be blocked; the visible path can still be selected manually. */}
  }

  return <form action={formAction} className="stack card admin-form">
    {children}
    {state.error&&<p role="alert" className="notice">{state.error}</p>}
    {state.success&&<div className="admin-page-actions"><p role="status" className="notice">{state.success}</p>{copyValue&&<button type="button" className="admin-btn" onClick={copyResult}>{copied?'কপি হয়েছে ✓':'path কপি করুন'}</button>}</div>}
    <div className="admin-form-actions"><Submit>{label??'সংরক্ষণ করুন'}</Submit></div>
  </form>;
}
