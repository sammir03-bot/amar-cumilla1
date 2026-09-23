'use client';
import {createBrowserClient} from '@supabase/ssr';
import {inspectMedia,MAX_MEDIA_BYTES} from './upload-types';
/** Media goes directly to private Storage, avoiding the hosting request-size limit. */
export async function uploadSelectedFiles(form:FormData,mode:'post'|'library'|'profile',progress:(message:string)=>void){
 const name=mode==='post'?'media_files':mode==='library'?'file':'photo_file';
 const files=form.getAll(name).filter((f):f is File=>f instanceof File&&f.size>0);
 const empty={cleanup:async()=>{}};
 if(!files.length)return empty;
 const maxFiles=mode==='post'?4:1;
 if(files.length>maxFiles||files.some(f=>f.size>MAX_MEDIA_BYTES)||files.reduce((n,f)=>n+f.size,0)>20*1024*1024)throw new Error('প্রতি ফাইল ৮ MB এবং মোট ২০ MB-এর মধ্যে রাখুন।');
 const db=createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
 const {data:{user},error}=await db.auth.getUser();
 if(error||!user)throw new Error('লগইনের মেয়াদ শেষ হয়েছে। আবার লগইন করে চেষ্টা করুন।');
 const paths:string[]=[];
 const cleanup=async()=>{if(paths.length)await db.storage.from('cumilla-media').remove(paths);};
 try{
  for(const [i,file] of files.entries()){
   const checked=await inspectMedia(file);if(!checked||mode==='profile'&&checked.extension==='pdf')throw new Error(mode==='profile'?'প্রোফাইল ছবির জন্য JPG, PNG বা WebP নির্বাচন করুন।':'সঠিক JPG, PNG, WebP বা PDF ফাইল নির্বাচন করুন।');
   progress(`${mode==='profile'?'প্রোফাইল ছবি':'ছবি'} আপলোড হচ্ছে… ${(i+1).toLocaleString('bn-BD')} / ${files.length.toLocaleString('bn-BD')}`);
   const path=user.id+'/'+crypto.randomUUID()+'.'+checked.extension;
   const {error:uploadError}=await db.storage.from('cumilla-media').upload(path,file,{contentType:checked.mime,upsert:false});
   if(uploadError)throw new Error('ফাইল আপলোড হয়নি। সংযোগ দেখে আবার চেষ্টা করুন।');
   paths.push(path);
  }
 }catch(error){await cleanup();throw error;}
 form.delete(name);
 paths.forEach(path=>{form.append('newly_uploaded_paths',path);if(mode==='post')form.append('keep_media_paths',path);});
 if(mode==='post'){
  const choice=String(form.get('cover_selection')??'');
  if(choice.startsWith('new:')){const index=Number(choice.slice(4));if(Number.isInteger(index)&&paths[index])form.set('cover_selection',paths[index]);}
 }else form.set('uploaded_path',paths[0]);
 progress('তথ্য সংরক্ষণ হচ্ছে…');
 return {cleanup};
}
