import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getProfile,profileArea,profilePhoto} from '../../../lib/profiles';
import ProfileView from '../../../components/profile-view';

export const dynamic='force-dynamic';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const profile=await getProfile(slug);
 if(!profile)return {title:'পরিচিতি পাওয়া যায়নি'};
 const area=profileArea(profile);
 return {title:`${profile.name} | Amar Cumilla–1`,description:[profile.designation,area,profile.bio.slice(0,120)].filter(Boolean).join(' · ')};
}

export default async function ProfilePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const profile=await getProfile(slug);
 if(!profile)notFound();
 const image=await profilePhoto(profile);
 return <ProfileView profile={profile} image={image}/>;
}
