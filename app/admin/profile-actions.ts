'use server';
import {z} from 'zod';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import type {FormState} from '../../components/action-form';
import {allowedMediaUrl} from '../../lib/remote-media';
import {inspectMedia} from '../../lib/upload-types';
import {requireStaff} from '../../lib/supabase';
import {canChangeProfile,profileSlug,resolveProfilePhoto,type PhotoMode} from '../../lib/profile-rules';

const text=(f:FormData,k:string)=>String(f.get(k)??'').trim();
const imagePath=/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.(jpg|png|webp)$/;
const labels:Record<string,string>={name:'নাম',slug:'প্রোফাইল লিংক',designation:'পদবি',area_name:'এলাকা',email:'ইমেইল',bio:'জীবনী',sort_order:'ক্রম',status:'প্রকাশের অবস্থা',profile_type:'পরিচিতির ধরন'};
const schema=z.object({
 profile_type:z.enum(['candidate','responsible']),name:z.string().min(1).max(180),
 slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(140),
 designation:z.string().max(180),area_name:z.string().max(180),upazila:z.enum(['','daudkandi','meghna']),
 union_name:z.string().max(180),bio:z.string().max(30000),education:z.string().max(3000),profession:z.string().max(500),
 phone:z.string().max(80),email:z.string().max(180),facebook_url:z.string().max(2000),website_url:z.string().max(2000),
 photo_url:z.string().max(2000),source_url:z.string().max(2000),status:z.enum(['draft','published','archived']),
 sort_order:z.coerce.number().int().min(0).max(9999),
});
function refreshProfiles(slug:string,oldSlug?:string){
 for(const path of ['/','/profiles','/admin','/admin/profiles','/profiles/'+slug])revalidatePath(path);
 if(oldSlug&&oldSlug!==slug)revalidatePath('/profiles/'+oldSlug);
}

export async function saveProfile(_:FormState,f:FormData):Promise<FormState>{
 const {db,user,role}=await requireStaff();
 const id=text(f,'id');
 if(id&&!z.uuid().safeParse(id).success)return {error:'পরিচিতির রেকর্ড সঠিক নয়। তালিকা থেকে আবার খুলুন।'};
 const oldResult=id?await db.from('cumilla_profiles').select('photo_path,photo_url,status,slug,updated_at').eq('id',id).maybeSingle():null;
 if(id&&(oldResult?.error||!oldResult?.data))return {error:'পরিচিতিটি পাওয়া যায়নি। তালিকা থেকে আবার খুলুন।'};
 const old=oldResult?.data;
 if(old&&old.updated_at!==text(f,'version'))return {error:'এই পরিচিতি অন্য ট্যাব থেকে বদলানো হয়েছে। আপনার লেখা কপি করে পেজ রিফ্রেশ করুন, তারপর আবার সংরক্ষণ করুন।'};
 const intent=text(f,'intent');
 const status=intent==='publish'?'published':intent==='draft'?'draft':intent==='archive'?'archived':old?.status??'draft';
 if(!canChangeProfile(role,old?.status,status))return {error:'এই প্রকাশিত পরিচিতি পরিবর্তনের জন্য Publisher বা Admin প্রয়োজন।'};
 const input=Object.fromEntries(Object.keys(schema.shape).map(k=>[k,text(f,k)]));
 input.status=status;
 input.slug=profileSlug(input.slug,input.name,input.profile_type,crypto.randomUUID());
 input.sort_order=input.sort_order||'0';
 const parsed=schema.safeParse(input);
 if(!parsed.success){const key=String(parsed.error.issues[0]?.path[0]??'');return {error:`${labels[key]??'পরিচিতির তথ্য'} সঠিকভাবে দিন। প্রোফাইল লিংকে শুধু ইংরেজি ছোট অক্ষর, সংখ্যা ও হাইফেন ব্যবহার করুন।`};}
 const data=parsed.data;
 if(data.email&&!z.email().safeParse(data.email).success)return {error:'ইমেইল ঠিকানা সঠিক নয়।'};
 const mode=text(f,'photo_mode') as PhotoMode;
 if(!['keep','upload','external','none'].includes(mode))return {error:'ছবি রাখবেন, বদলাবেন নাকি সরাবেন—নির্বাচন করুন।'};
 for(const [label,value] of [['Facebook',data.facebook_url],['ওয়েবসাইট',data.website_url],['তথ্যসূত্র',data.source_url],['ছবি',mode==='external'?data.photo_url:'']] as const){
  if(!value)continue;
  try{const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password)throw new Error();}catch{return {error:`${label} অবশ্যই পূর্ণ https:// লিংক হতে হবে।`};}
 }
 if(mode==='external'&&!allowedMediaUrl(data.photo_url))return {error:'এই ছবির লিংক সমর্থিত নয়। ছবিটি সরাসরি আপলোড করুন।'};
 const uploaded=text(f,'uploaded_path');
 if(mode==='upload'){
  if(!uploaded||!imagePath.test(uploaded)||!uploaded.startsWith(user.id+'/'))return {error:'একটি JPG, PNG বা WebP ছবি নির্বাচন করুন।'};
  const {data:blob,error}=await db.storage.from('cumilla-media').download(uploaded);
  const checked=!error&&blob?await inspectMedia(blob):null;
  if(!checked||checked.extension==='pdf')return {error:'আপলোড করা ছবিটি যাচাই করা যায়নি। আবার নির্বাচন করুন।'};
 }
 const photo=resolveProfilePhoto(mode,old?.photo_path??null,old?.photo_url??null,uploaded,data.photo_url);
 if(!photo)return {error:mode==='external'?'ছবির লিংক দিন।':'একটি প্রোফাইল ছবি নির্বাচন করুন।'};
 const payload={...data,...photo,upazila:data.upazila||null,facebook_url:data.facebook_url||null,website_url:data.website_url||null,source_url:data.source_url||null,featured:f.get('featured')==='on',updated_at:new Date().toISOString()};
 const result=id
  ?await db.from('cumilla_profiles').update(payload).eq('id',id).eq('updated_at',text(f,'version')).select('id,slug').maybeSingle()
  :await db.from('cumilla_profiles').insert({...payload,created_by:user.id}).select('id,slug').single();
 if(result.error){
  console.error('Profile save failed',{code:result.error.code});
  return {error:result.error.code==='23505'?'এই প্রোফাইল লিংক আগে ব্যবহার হয়েছে। লিংকের শেষে একটি সংখ্যা যোগ করুন।':'সংরক্ষণ হয়নি। আপনার লেখা এখানেই আছে—সংযোগ দেখে আবার চেষ্টা করুন।'};
 }
 if(!result.data)return {error:'পরিচিতিটি ইতিমধ্যে পরিবর্তিত হয়েছে। লেখা কপি করে পেজ রিফ্রেশ করুন।'};
 refreshProfiles(result.data.slug,old?.slug);
 revalidatePath('/admin/profiles/'+result.data.id);
 redirect('/admin/profiles/'+result.data.id+'?saved='+status);
}

export async function setProfileStatus(_:FormState,f:FormData):Promise<FormState>{
 const {db,role}=await requireStaff();
 const id=text(f,'id'),next=text(f,'next_status'),version=text(f,'version');
 if(!z.uuid().safeParse(id).success||!['draft','published','archived'].includes(next)||!version)return {error:'পরিচিতি আবার খুলে চেষ্টা করুন।'};
 const {data:old,error}=await db.from('cumilla_profiles').select('status,slug').eq('id',id).maybeSingle();
 if(error||!old)return {error:'পরিচিতি পাওয়া যায়নি।'};
 if(!canChangeProfile(role,old.status,next as 'draft'|'published'|'archived'))return {error:'প্রকাশের জন্য Publisher বা Admin প্রয়োজন।'};
 const {data,error:saveError}=await db.from('cumilla_profiles').update({status:next,updated_at:new Date().toISOString()}).eq('id',id).eq('updated_at',version).select('id').maybeSingle();
 if(saveError||!data)return {error:'পরিচিতি বদলেছে অথবা সংরক্ষণ হয়নি। তালিকা রিফ্রেশ করে আবার চেষ্টা করুন।'};
 refreshProfiles(old.slug);
 revalidatePath('/admin/profiles/'+id);
 return {success:next==='published'?'পরিচিতি প্রকাশ হয়েছে।':next==='draft'?'খসড়ায় রাখা হয়েছে।':'আর্কাইভে রাখা হয়েছে।'};
}
