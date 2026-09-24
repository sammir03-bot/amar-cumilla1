import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getProfile,profileArea,profilePhoto} from '../../../lib/profiles';
import ProfileView from '../../../components/profile-view';

export const dynamic='force-dynamic';
const siteUrl='https://amar-cumilla1.vercel.app';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const profile=await getProfile(slug);
 if(!profile)return {title:'পরিচিতি পাওয়া যায়নি',robots:{index:false,follow:false}};
 const area=profileArea(profile);
 const title=`${profile.name} | Amar Cumilla–1`;
 const description=[profile.designation,area,profile.bio.slice(0,120)].filter(Boolean).join(' · ');
 const url=`${siteUrl}/profiles/${profile.slug}`;
 return {title,description,alternates:{canonical:url},openGraph:{type:'profile',url,title,description}};
}

export default async function ProfilePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const profile=await getProfile(slug);
 if(!profile)notFound();
 const image=await profilePhoto(profile);
 const area=profileArea(profile);
 const url=`${siteUrl}/profiles/${profile.slug}`;
 const schema={
  '@context':'https://schema.org',
  '@type':'ProfilePage',
  url,
  name:`${profile.name} | Amar Cumilla–1`,
  inLanguage:'bn-BD',
  mainEntity:{
   '@type':'Person',
   name:profile.name,
   ...(profile.designation?{jobTitle:profile.designation}:{}),
   ...(area?{homeLocation:{'@type':'Place',name:area}}:{}),
   ...(profile.bio?{description:profile.bio.slice(0,300)}:{}),
  },
 };
 const json=JSON.stringify(schema).replace(/</g,'\\u003c');
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:json}}/><ProfileView profile={profile} image={image}/></>;
}
