import 'server-only';
import {createServerClient} from '@supabase/ssr';
import {createClient} from '@supabase/supabase-js';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

export function config(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key) throw new Error('Database configuration missing');
 return {url,key};
}
export function publicDb(){const {url,key}=config();return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});}
export async function sessionDb(){
 const jar=await cookies();const {url,key}=config();
 return createServerClient(url,key,{cookies:{getAll:()=>jar.getAll(),setAll(items){try{items.forEach(({name,value,options})=>jar.set(name,value,options));}catch{/* Render-only cookie writes are handled by proxy. */}}}});
}
export async function requireStaff(){
 const db=await sessionDb();const {data:{user},error}=await db.auth.getUser();
 if(error||!user||!user.email_confirmed_at) redirect('/login');
 const {data:staff}=await db.from('cumilla_staff').select('role').eq('user_id',user.id).maybeSingle();
 if(!staff) redirect('/login?error=permission');
 return {db,user,role:staff.role as 'admin'|'editor'|'publisher'};
}
