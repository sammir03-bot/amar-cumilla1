'use client';
import {useFormStatus} from 'react-dom';
export default function Submit({children='সংরক্ষণ করুন'}:{children?:React.ReactNode}){const {pending}=useFormStatus();return <button disabled={pending} type="submit">{pending?'অপেক্ষা করুন…':children}</button>;}
