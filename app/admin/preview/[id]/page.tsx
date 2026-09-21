import {notFound} from 'next/navigation';
import {requireStaff} from '../../../../lib/supabase';
import {PostView} from '../../../../components/posts';
export default async function Preview({params}:{params:Promise<{id:string}>}){const {db}=await requireStaff();const {data,error}=await db.from('cumilla_posts').select('*').eq('id',(await params).id).maybeSingle();if(error)throw error;if(!data)notFound();async function sign(path:string){const {data}=await db.storage.from('cumilla-media').createSignedUrl(path,300);return data?.signedUrl??null;}return <><p className="notice">Admin প্রিভিউ · {data.status}</p><PostView post={data} sign={sign}/></>;}
