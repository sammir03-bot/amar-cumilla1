'use client';
import {createContext,useActionState,useEffect,useRef,useState} from 'react';
import Submit from './submit';
export type FormState={error?:string;success?:string};
export const FormChangeContext=createContext<()=>void>(()=>{});
export default function ActionForm({action,children,label,trackChanges=false,uploadMode}:{action:(state:FormState,data:FormData)=>Promise<FormState>;children:React.ReactNode;label?:string;trackChanges?:boolean;uploadMode?:'post'|'library'}){
 const [progress,setProgress]=useState('');
 const [dirty,setDirty]=useState(false),[copied,setCopied]=useState(false),notice=useRef<HTMLParagraphElement>(null);
 const [state,formAction]=useActionState(async (previous:FormState,data:FormData)=>{
  let cleanup=async()=>{};
  try{if(uploadMode){const module=await import('../lib/client-uploads');cleanup=(await module.uploadSelectedFiles(data,uploadMode,setProgress)).cleanup;}}
  catch(error){setProgress('');setDirty(true);return {error:error instanceof Error?error.message:'আপলোড হয়নি। আবার চেষ্টা করুন।'};}
  setDirty(false);
  const result=await action(previous,data);
  if(result.error){setDirty(true);await cleanup();}
  setProgress('');return result;
 },{});
 useEffect(()=>{if(!trackChanges||!dirty)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty,trackChanges]);
 useEffect(()=>{if(state.error){notice.current?.focus();notice.current?.scrollIntoView({block:'center',behavior:'smooth'});}},[state]);
 const copyValue=state.success?.includes(': ')?state.success.split(': ').slice(1).join(': ').trim():'';
 async function copyResult(){if(!copyValue)return;try{await navigator.clipboard.writeText(copyValue);setCopied(true);}catch{setCopied(false);}}
 return <FormChangeContext.Provider value={()=>{if(trackChanges)setDirty(true);}}><form action={formAction} className="stack card admin-form" onReset={e=>{if(trackChanges)e.preventDefault();}} onChange={()=>trackChanges&&setDirty(true)}>{children}{progress&&<p role="status" className="notice">{progress}</p>}{state.error&&<p ref={notice} tabIndex={-1} role="alert" className="notice">{state.error}</p>}{state.success&&<div className="admin-page-actions"><p role="status" className="notice">{state.success}</p>{copyValue&&<button type="button" className="admin-btn" onClick={copyResult}>{copied?'কপি হয়েছে':'ফাইল লিংক কপি করুন'}</button>}</div>}<div className="admin-form-actions">{trackChanges&&<span className="studio-save-hint" role="status">{dirty?'পরিবর্তন এখনো সংরক্ষণ হয়নি':'তথ্য প্রস্তুত হলে সংরক্ষণ করুন'}</span>}<Submit>{label??'সংরক্ষণ করুন'}</Submit></div></form></FormChangeContext.Provider>;
}
