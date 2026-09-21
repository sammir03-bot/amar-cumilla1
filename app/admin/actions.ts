'use server';
import {z} from 'zod';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireStaff} from '../../lib/supabase';
import type {FormState} from '../../components/action-form';
const text=(f:FormData,k:string)=>String(f.get(k)??'').trim();
const postSchema=z.object({title:z.string().min(1).max(180),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(140),body:z.string().min(1).max(100000),kind:z.enum(['news','event','leader','gallery','document','page','archive']),status:z.enum(['draft','review','published','archived']),venue:z.string().max(500),area_keys:z.array(z.string().max(150)).max(24),media_paths:z.array(z.string().regex(/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.(jpg|png|webp|pdf)$/)).max(20)});
export async function savePost(_:FormState,f:FormData):Promise<FormState>{
 const {db,user,role}=await requireStaff();const id=text(f,'id');
 const parsed=postSchema.safeParse({title:text(f,'title'),slug:text(f,'slug'),body:text(f,'body'),kind:text(f,'kind'),status:text(f,'status'),venue:text(f,'venue'),area_keys:f.getAll('area_keys').map(String),media_paths:text(f,'media_paths').split(/\r?\n/).map(s=>s.trim()).filter(Boolean)});
 if(!parsed.success)return {error:'শিরোনাম, slug, লেখা অথবা ফাইল path সঠিক নয়। প্রয়োজনীয় ঘরগুলো পরীক্ষা করুন।'};
 const data=parsed.data;if(role==='editor'&&!['draft','review'].includes(data.status))return {error:'প্রকাশের জন্য Publisher বা Admin প্রয়োজন।'};
 if(data.area_keys.length){const {data:valid,error}=await db.from('cumilla_areas').select('upazila,slug');if(error||data.area_keys.some(k=>!valid?.some(a=>`${a.upazila}/${a.slug}`===k)))return {error:'এলাকার নির্বাচন সঠিক নয়।'};}
 for(const path of data.media_paths){const {error}=await db.storage.from('cumilla-media').createSignedUrl(path,30);if(error)return {error:'কোনো ফাইল পাওয়া যায়নি। Media বিভাগ থেকে সঠিক path নিন।'};}
 const event=text(f,'event_at');const eventAt=event?new Date(event+'+06:00'):null;
 if(eventAt&&Number.isNaN(eventAt.valueOf()))return {error:'কর্মসূচির সময় সঠিক নয়।'};
 let publishedAt:string|null=data.status==='published'?new Date().toISOString():null;
 if(id){if(!z.string().uuid().safeParse(id).success)return {error:'রেকর্ড সঠিক নয়।'};const {data:old}=await db.from('cumilla_posts').select('published_at').eq('id',id).maybeSingle();if(!old)return {error:'রেকর্ড পাওয়া যায়নি।'};if(data.status==='published'&&old.published_at)publishedAt=old.published_at;}
 const payload={...data,event_at:eventAt?.toISOString()??null,published_at:publishedAt};
 const result=id?await db.from('cumilla_posts').update(payload).eq('id',id).eq('updated_at',text(f,'version')).select('id').maybeSingle():await db.from('cumilla_posts').insert({...payload,author_id:user.id}).select('id').single();
 if(result.error)return {error:result.error.code==='23505'?'এই slug আগে ব্যবহৃত হয়েছে। অন্য slug দিন।':'সংরক্ষণ হয়নি। আপনার অনুমতি ও সংযোগ পরীক্ষা করুন।'};
 if(!result.data)return {error:'রেকর্ড অন্য কেউ পরিবর্তন করেছেন। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।'};
 revalidatePath('/','layout');redirect('/admin/content/'+result.data.id+'?saved=1');
}
export async function saveArea(_:FormState,f:FormData):Promise<FormState>{
 const {db,role}=await requireStaff();if(role!=='admin')return {error:'শুধু Admin এলাকার তথ্য পরিবর্তন করতে পারবেন।'};
 const published=f.get('published')==='on',verified=f.get('verified')==='on';const source=text(f,'source_url');
 const parsed=z.object({id:z.string().uuid(),name:z.string().min(1).max(180),description:z.string().max(20000),villages:z.string().max(20000),institutions:z.string().max(20000),services:z.string().max(20000)}).safeParse({id:text(f,'id'),name:text(f,'name'),description:text(f,'description'),villages:text(f,'villages'),institutions:text(f,'institutions'),services:text(f,'services')});
 if(!parsed.success)return {error:'নাম অথবা তথ্যের দৈর্ঘ্য সঠিক নয়।'};
 if(source&&!/^https:\/\//.test(source))return {error:'তথ্যসূত্রে পূর্ণ https:// লিংক দিন।'};
 if(source){try{new URL(source);}catch{return {error:'তথ্যসূত্রের লিংক সঠিক নয়।'};}}
 if(published&&(!verified||!source||!parsed.data.description))return {error:'প্রকাশের আগে পরিচিতি, তথ্যসূত্র এবং যাচাইয়ের নিশ্চয়তা দিন।'};
 const {id,...details}=parsed.data;
 const {data,error}=await db.from('cumilla_areas').update({...details,source_url:source||null,verified_at:verified?new Date().toISOString():null,published}).eq('id',id).eq('updated_at',text(f,'version')).select('id').maybeSingle();
 if(error||!data)return {error:'সংরক্ষণ হয়নি অথবা তথ্য অন্য কেউ পরিবর্তন করেছেন। রিফ্রেশ করে চেষ্টা করুন।'};
 revalidatePath('/','layout');redirect('/admin/areas/'+id+'?saved=1');
}
export async function uploadMedia(_:FormState,f:FormData):Promise<FormState>{
 const {db,user}=await requireStaff();const file=f.get('file');if(!(file instanceof File)||file.size===0||file.size>2097152)return {error:'সর্বোচ্চ ২ MB-এর একটি JPG, PNG, WebP বা PDF দিন।'};
 const bytes=new Uint8Array(await file.arrayBuffer());const prefix=String.fromCharCode(...bytes.slice(0,12));
 const extension=bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'jpg':bytes[0]===137&&prefix.slice(1,4)==='PNG'?'png':prefix.startsWith('RIFF')&&prefix.slice(8,12)==='WEBP'?'webp':prefix.startsWith('%PDF-')?'pdf':null;
 if(!extension)return {error:'ফাইলের ধরন অনুমোদিত নয়।'};
 const mime=extension==='jpg'?'image/jpeg':extension==='pdf'?'application/pdf':'image/'+extension;
 const path=`${user.id}/${crypto.randomUUID()}.${extension}`;const {error}=await db.storage.from('cumilla-media').upload(path,bytes,{contentType:mime,upsert:false});
 if(error)return {error:'আপলোড হয়নি। সংযোগ ও অনুমতি পরীক্ষা করুন।'};
 return {success:`আপলোড হয়েছে। প্রকাশনার ফাইল path ঘরে এটি কপি করুন: ${path}`};
}
