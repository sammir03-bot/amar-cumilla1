'use client';
import {useActionState} from 'react';
import Submit from './submit';
export type FormState={error?:string;success?:string};
export default function ActionForm({action,children,label}:{action:(state:FormState,data:FormData)=>Promise<FormState>;children:React.ReactNode;label?:string}){const [state,formAction]=useActionState(action,{});return <form action={formAction} className="stack card">{children}{state.error&&<p role="alert" className="notice">{state.error}</p>}{state.success&&<p role="status" className="notice">{state.success}</p>}<Submit>{label??'সংরক্ষণ করুন'}</Submit></form>;}
