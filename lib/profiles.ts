import 'server-only';
import {cache} from 'react';
import {mediaUrl} from './content';
import {publicDb} from './supabase';
import type {SupabaseClient} from '@supabase/supabase-js';

export type ProfileType='candidate'|'responsible';
export type Profile={
  id:string;
  profile_type:ProfileType;
  name:string;
  slug:string;
  designation:string;
  area_name:string;
  upazila:'daudkandi'|'meghna'|null;
  union_name:string;
  bio:string;
  education:string;
  profession:string;
  phone:string;
  email:string;
  facebook_url:string|null;
  website_url:string|null;
  photo_path:string|null;
  photo_url:string|null;
  source_url:string|null;
  status:'draft'|'published'|'archived';
  featured:boolean;
  sort_order:number;
  created_by:string;
  created_at:string;
  updated_at:string;
};

export const profileTypeNames:Record<ProfileType,string>={candidate:'প্রার্থী পরিচিতি',responsible:'স্থানীয় দায়িত্বশীল'};

export async function getProfiles(type?:ProfileType){
  let query=publicDb().from('cumilla_profiles').select('*').eq('status','published');
  if(type)query=query.eq('profile_type',type);
  const {data,error}=await query.order('sort_order',{ascending:true}).order('updated_at',{ascending:false});
  if(error)throw new Error('পরিচিতির তথ্য আনা যায়নি');
  return (data??[]) as Profile[];
}

export const getProfile=cache(async(slug:string)=>{
  const {data,error}=await publicDb().from('cumilla_profiles').select('*').eq('slug',slug).eq('status','published').maybeSingle();
  if(error)throw new Error('পরিচিতির তথ্য আনা যায়নি');
  return data as Profile|null;
});

export async function profilePhoto(profile:Pick<Profile,'photo_path'|'photo_url'>){
  const raw=profile.photo_path||profile.photo_url;
  return raw?await mediaUrl(raw):null;
}

/** One Storage request for a list, instead of a request for every profile. */
export async function profilePhotos<T extends Pick<Profile,'photo_path'|'photo_url'>>(profiles:T[],db:SupabaseClient=publicDb()){
 const paths=[...new Set(profiles.flatMap(p=>p.photo_path?[p.photo_path]:[]))];
 const urls=new Map<string,string>();
 if(paths.length){
  const {data,error}=await db.storage.from('cumilla-media').createSignedUrls(paths,300);
  if(error)console.error('Profile photo signing failed',error.name);
  for(const item of data??[])if(item.path&&item.signedUrl)urls.set(item.path,item.signedUrl);
 }
 return profiles.map(profile=>({profile,image:profile.photo_path?urls.get(profile.photo_path)??null:profile.photo_url?'/media-proxy?url='+encodeURIComponent(profile.photo_url):null}));
}

export function profileArea(profile:Pick<Profile,'area_name'|'union_name'|'upazila'>){
  if(profile.area_name)return profile.area_name;
  if(profile.union_name)return profile.union_name;
  if(profile.upazila==='daudkandi')return 'দাউদকান্দি';
  if(profile.upazila==='meghna')return 'মেঘনা';
  return '';
}
