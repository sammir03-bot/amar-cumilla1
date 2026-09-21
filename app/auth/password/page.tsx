import {sessionDb} from '../../../lib/supabase';
import {redirect} from 'next/navigation';
import {updatePassword} from '../../login/actions';
import Submit from '../../../components/submit';
export default async function Password({searchParams}:{searchParams:Promise<{error?:string}>}){const db=await sessionDb();const {data:{user}}=await db.auth.getUser();if(!user)redirect('/login');const p=await searchParams;return <section className="narrow"><h1>নতুন পাসওয়ার্ড</h1>{p.error&&<p role="alert">পাসওয়ার্ড পরিবর্তন হয়নি। কমপক্ষে ১২ অক্ষর ব্যবহার করুন।</p>}<form action={updatePassword} className="card stack"><label>নতুন পাসওয়ার্ড<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/></label><Submit>পাসওয়ার্ড সংরক্ষণ</Submit></form></section>;}
