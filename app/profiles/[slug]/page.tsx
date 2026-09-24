import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getProfile,profileArea,profilePhoto} from '../../../lib/profiles';
import ProfileView from '../../../components/profile-view';

export const dynamic='force-dynamic';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const profile=await getProfile(slug);
 if(!profile)return {title:'পরিচিতি পাওয়া যায়নি',robots:{index:false,follow:false}};
 const area=profileArea(profile);
 const title=`${profile.name} | Amar Cumilla–1`;
 const description=[profile.designation,area,profile.bio.slice(0,120)].filter(Boolean).join(' · ');
 const url=`https://amar-cumilla1.vercel.app/profiles/${profile.slug}`;
 return {title,description,alternates:{canonical:url},openGraph:{type:'profile',url,title,description}};
}

export default async function ProfilePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const profile=await getProfile(slug);
 if(!profile)notFound();
 const image=await profilePhoto(profile);
 return <ProfileView profile={profile} image={image}/>;
}
