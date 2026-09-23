import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getProfile,profileArea,profilePhoto} from '../../../lib/profiles';
import styles from '../profiles.module.css';

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
 const area=profileArea(profile);
 const facts=[['পদবি / দায়িত্ব',profile.designation],['এলাকা',area],['পেশা',profile.profession],['ফোন',profile.phone],['ইমেইল',profile.email]] as const;
 return <main className={styles.page}><section className={styles.detail}><Link className={styles.back} href="/profiles">← সব পরিচিতি</Link><div className={styles.detailTop}><div className={styles.portrait}>{image?<img src={image} alt={profile.name}/>:<div className={styles.portraitFallback}>{profile.name.slice(0,1)}</div>}</div><div className={styles.meta}><small>{profile.profile_type==='candidate'?'প্রার্থী পরিচিতি':'স্থানীয় দায়িত্বশীল'}</small><h1>{profile.name}</h1>{profile.designation&&<strong>{profile.designation}</strong>}{area&&<div className={styles.area}>{area}</div>}{profile.bio&&<p className={styles.bio}>{profile.bio}</p>}<div className={styles.facts}>{facts.filter(([,value])=>value).map(([label,value])=><div className={styles.fact} key={label}><small>{label}</small><strong>{value}</strong></div>)}{profile.facebook_url&&<div className={styles.fact}><small>Facebook</small><a href={profile.facebook_url} target="_blank" rel="noreferrer">প্রোফাইল দেখুন ↗</a></div>}{profile.website_url&&<div className={styles.fact}><small>ওয়েবসাইট</small><a href={profile.website_url} target="_blank" rel="noreferrer">ভিজিট করুন ↗</a></div>}</div>{profile.education&&<section className={styles.section}><h2>শিক্ষাগত যোগ্যতা</h2><p>{profile.education}</p></section>}{profile.source_url&&<p className={styles.source}>তথ্যসূত্র: <a href={profile.source_url} target="_blank" rel="noreferrer">মূল উৎস ↗</a></p>}</div></div></section></main>;
}
