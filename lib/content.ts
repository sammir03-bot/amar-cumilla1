import 'server-only';
import {cache} from 'react';
import {publicDb} from './supabase';
import {postCoverPath} from './post-cover';
export const kinds:Record<string,string>={news:'সংবাদ ও বিবৃতি',event:'কর্মসূচি',leader:'নেতৃত্ব',gallery:'গ্যালারি',document:'প্রকাশনা',page:'সাধারণ পাতা',archive:'নির্বাচনী আর্কাইভ'};
export type Post={id:string;title:string;slug:string;body:string;kind:string;status:string;author_id:string;published_at:string|null;created_at:string;updated_at:string;area_keys:string[];media_paths:string[];event_at:string|null;venue:string;source_url:string|null;source_name:string|null;cover_url:string|null;cover_source_url:string|null;cover_credit:string|null;cover_license:string|null;cover_selection?:string|null};
export type Area={id:string;upazila:string;slug:string;name:string;kind:string;description:string;source_url:string|null;verified_at:string|null;published:boolean;villages:string;institutions:string;services:string;updated_at:string;image_url:string|null;image_source_url:string|null;image_credit:string|null;image_license:string|null};
export const getAreas=cache(async()=>{const {data,error}=await publicDb().from('cumilla_areas').select('*').eq('published',true).not('verified_at','is',null).order('name');if(error)throw new Error('এলাকার তথ্য আনা যায়নি');return data as Area[];});
export async function getPosts(kind?:string,area?:string,page=1){let q=publicDb().from('cumilla_posts').select('*',{count:'exact'}).eq('status','published').lte('published_at',new Date().toISOString());if(kind)q=q.eq('kind',kind);if(area)q=q.contains('area_keys',[area]);const {data,error,count}=await q.order('published_at',{ascending:false}).range((page-1)*12,page*12-1);if(error)throw new Error('প্রকাশনা আনা যায়নি');const posts=data as Post[];return {posts,count:count??0};}
export const getPost=cache(async(slug:string)=>{const {data,error}=await publicDb().from('cumilla_posts').select('*').eq('slug',slug).eq('status','published').lte('published_at',new Date().toISOString()).maybeSingle();if(error)throw new Error('প্রকাশনা আনা যায়নি');return data as Post|null;});
export async function mediaUrl(path:string){if(/^https:\/\//i.test(path))return `/media-proxy?url=${encodeURIComponent(path)}`;const {data}=await publicDb().storage.from('cumilla-media').createSignedUrl(path,300);return data?.signedUrl??null;}
export function bnDate(date:string){return new Intl.DateTimeFormat('bn-BD',{dateStyle:'long',timeZone:'Asia/Dhaka'}).format(new Date(date));}

/** Scan past news without photos so older photographed stories are not lost. */
export async function getHomeNews(limit=5){
 const db=publicDb(),selected:Post[]=[];
 const now=new Date().toISOString();
 for(let offset=0;selected.length<limit;offset+=40){
  const {data,error}=await db.from('cumilla_posts').select('*').eq('kind','news').eq('status','published').lte('published_at',now).order('published_at',{ascending:false}).order('id').range(offset,offset+39);
  if(error)throw new Error('সংবাদ আনা যায়নি');
  const batch=(data??[]) as Post[];
  selected.push(...batch.filter(p=>postCoverPath(p)).slice(0,limit-selected.length));
  if(batch.length<40)break;
 }
 return selected;
}
