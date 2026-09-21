'use server';
import {sessionDb} from '../../lib/supabase';
import {redirect} from 'next/navigation';
export async function login(form:FormData){
 const email=String(form.get('email')??'').trim();const password=String(form.get('password')??'');
 if(email.length>254||!email.includes('@')||password.length<1||password.length>200)redirect('/login?error=credentials');
 const db=await sessionDb();const {error}=await db.auth.signInWithPassword({email,password});
 if(error)redirect('/login?error=credentials');redirect('/admin');
}
export async function logout(){const db=await sessionDb();await db.auth.signOut();redirect('/login');}
export async function recovery(form:FormData){
 const origin=process.env.SITE_URL;
 if(!origin)redirect('/login?error=recovery_unavailable');
 const email=String(form.get('email')??'').trim();
 if(!email.includes('@')||email.length>254)redirect('/login?error=credentials');
 const db=await sessionDb();const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo:new URL('/auth/callback',origin).href});
 if(error)redirect('/login?error=recovery_failed');redirect('/login?sent=1');
}
export async function updatePassword(form:FormData){const db=await sessionDb();const {data:{user}}=await db.auth.getUser();if(!user)redirect('/login');const password=String(form.get('password')??'');if(password.length<12||password.length>128)redirect('/auth/password?error=length');const {error}=await db.auth.updateUser({password});if(error)redirect('/auth/password?error=failed');redirect('/admin');}
