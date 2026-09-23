'use server';
import {z} from 'zod';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import type {FormState} from '../../components/action-form';
import {allowedMediaUrl} from '../../lib/remote-media';
import {inspectMedia} from '../../lib/upload-types';
import {requireStaff} from '../../lib/supabase';

const text=(f:FormData,k:string)=>String(f.get(k)??'').trim();
const imagePath=/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.(jpg|png|webp)$/;
const slugPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function httpsOrBlank(value:string){
 if(!value)return true;
 try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password;}catch{return false;}
}

async function verifyUploadedPhoto(db:any,userId:string,path:string){
 if(!path||!imagePath.test(path)||!path.startsWith(userId+'/'))return false;
 const {data,error}=await db.storage.from('cumilla-media').download(path);
 if(error||!data)return false;
 const checked=await inspectMedia(data);
 return !!checked&&checked.extension!=='pdf';
}

const schema=z.object({
 profile_type:z.enum(['candidate','responsible']),
 name:z.string().min(1).max(180),
 slug:z.string().regex(slugPattern).max(140),
 designation:z.string().max(180),
 area_name:z.string().max(180),
 upazila:z.enum(['','daudkandi','meghna']),
 union_name:z.string().max(180),
 bio:z.string().max(30000),
 education:z.string().max(3000),
 profession:z.string().max(500),
 phone:z.string().max(80),
 email:z.string().max(180),
 facebook_url:z.string().max(2000),
 website_url:z.string().max(2000),
 photo_url:z.string().max(2000),
 source_url:z.string().max(2000),
 status:z.enum(['draft','published','archived']),
 sort_order:z.coerce.number().int().min(0).max(9999),
});

export async function saveProfile(_:FormState,f:FormData):Promise<FormState>{
 const {db,user,role}=await requireStaff();
 const id=text(f,'id');
 const parsed=schema.safeParse({
  profile_type:text(f,'profile_type'),name:text(f,'name'),slug:text(f,'slug'),designation:text(f,'designation'),area_name:text(f,'area_name'),upazila:text(f,'upazila'),union_name:text(f,'union_name'),bio:text(f,'bio'),education:text(f,'education'),profession:text(f,'profession'),phone:text(f,'phone'),email:text(f,'email'),facebook_url:text(f,'facebook_url'),website_url:text(f,'website_url'),photo_url:text(f,'photo_url'),source_url:text(f,'source_url'),status:text(f,'status'),sort_order:text(f,'sort_order')||'0'
 });
 if(!parsed.success)return {error:'নাম, slug বা পরিচিতির কোনো তথ্য সঠিক নয়। ঘরগুলো আবার পরীক্ষা করুন।'};
 const data=parsed.data;
 if(role==='editor'&&data.status==='published')return {error:'প্রকাশ করার জন্য Publisher বা Admin প্রয়োজন।'};
 if(data.email&&!z.string().email().safeParse(data.email).success)return {error:'ইমেইল ঠিকানা সঠিক নয়।'};
 for(const [label,value] of [['Facebook',data.facebook_url],['ওয়েবসাইট',data.website_url],['ছবির URL',data.photo_url],['তথ্যসূত্র',data.source_url]] as const){
  if(value&&!httpsOrBlank(value))return {error:`${label} অবশ্যই পূর্ণ https:// লিংক হতে হবে।`};
 }
 if(data.photo_url&&!allowedMediaUrl(data.photo_url))return {error:'এই বাইরের ছবির লিংক নিরাপদভাবে দেখানো যাচ্ছে না। ছবিটি সরাসরি আপলোড করুন।'};
 const uploaded=text(f,'uploaded_path');
 if(uploaded&&!await verifyUploadedPhoto(db,user.id,uploaded))return {error:'আপলোড করা প্রোফাইল ছবি যাচাই করা যায়নি। আবার নির্বাচন করুন।'};

 let old:any=null;
 if(id){
  if(!z.string().uuid().safeParse(id).success)return {error:'প্রোফাইল রেকর্ড সঠিক নয়।'};
  const result=await db.from('cumilla_profiles').select('photo_path,updated_at').eq('id',id).maybeSingle();
  if(result.error||!result.data)return {error:'প্রোফাইল পাওয়া যায়নি।'};
  old=result.data;
 }
 const clearPhoto=f.get('clear_photo')==='on';
 const photoPath=uploaded||(!clearPhoto?old?.photo_path??null:null);
 const payload={
  ...data,
  upazila:data.upazila||null,
  facebook_url:data.facebook_url||null,
  website_url:data.website_url||null,
  photo_url:photoPath?null:data.photo_url||null,
  source_url:data.source_url||null,
  photo_path:photoPath,
  featured:f.get('featured')==='on',
  updated_at:new Date().toISOString(),
 };
 const result=id
  ?await db.from('cumilla_profiles').update(payload).eq('id',id).eq('updated_at',text(f,'version')).select('id,slug').maybeSingle()
  :await db.from('cumilla_profiles').insert({...payload,created_by:user.id}).select('id,slug').single();
 if(result.error||!result.data){
  if(result.error?.code==='23505')return {error:'এই slug আগে ব্যবহার হয়েছে। অন্য slug দিন।'};
  return {error:'প্রোফাইল সংরক্ষণ হয়নি। আবার চেষ্টা করুন।'};
 }
 revalidatePath('/','layout');
 revalidatePath('/profiles');
 revalidatePath('/profiles/'+result.data.slug);
 redirect('/admin/profiles/'+result.data.id+'?saved=1');
}
