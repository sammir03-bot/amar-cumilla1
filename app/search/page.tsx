import type {Metadata} from 'next';
import Link from 'next/link';
import {kinds} from '../../lib/content';
import {publicDb} from '../../lib/supabase';
import styles from './search.module.css';

export const metadata:Metadata={
 title:'সাইটে খুঁজুন',
 description:'Amar Cumilla–1-এর প্রকাশিত সংবাদ, পরিচিতি ও এলাকার তথ্য খুঁজুন।',
 robots:{index:false,follow:true},
};

type PostResult={id:string;title:string;slug:string;kind:string;published_at:string|null};
type ProfileResult={id:string;name:string;slug:string;profile_type:string;designation:string;area_name:string;union_name:string};
type AreaResult={id:string;name:string;slug:string;upazila:string;kind:string;description:string};

function pattern(value:string){return `%${value.replace(/[\\%_]/g,'\\$&')}%`;}

export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}){
 const raw=(await searchParams).q??'';
 const q=raw.trim().replace(/\s+/g,' ').slice(0,80);
 let posts:PostResult[]=[],profiles:ProfileResult[]=[],areas:AreaResult[]=[];
 let failed=false;
 if(q.length>=2){
  const db=publicDb(),like=pattern(q),now=new Date().toISOString();
  const [postResult,profileResult,areaResult]=await Promise.all([
   db.from('cumilla_posts').select('id,title,slug,kind,published_at').eq('status','published').lte('published_at',now).ilike('title',like).order('published_at',{ascending:false}).limit(10),
   db.from('cumilla_profiles').select('id,name,slug,profile_type,designation,area_name,union_name').eq('status','published').ilike('name',like).order('sort_order',{ascending:true}).limit(10),
   db.from('cumilla_areas').select('id,name,slug,upazila,kind,description').eq('published',true).not('verified_at','is',null).ilike('name',like).order('name').limit(10),
  ]);
  failed=!!(postResult.error||profileResult.error||areaResult.error);
  posts=(postResult.data??[]) as PostResult[];
  profiles=(profileResult.data??[]) as ProfileResult[];
  areas=(areaResult.data??[]) as AreaResult[];
 }
 const total=posts.length+profiles.length+areas.length;
 return <main className={styles.page}>
  <header className={styles.hero}><span className={styles.kicker}>SITE SEARCH</span><h1>এক জায়গা থেকে সব তথ্য খুঁজুন</h1><p>প্রকাশিত সংবাদ, প্রার্থী ও দায়িত্বশীলের পরিচিতি এবং দাউদকান্দি–মেঘনার এলাকার তথ্য নাম বা শিরোনাম দিয়ে খুঁজুন।</p></header>
  <form className={styles.form} action="/search" method="get" role="search"><input name="q" defaultValue={q} minLength={2} maxLength={80} autoComplete="off" placeholder="যেমন: গৌরীপুর, মেঘনা, কোনো ব্যক্তির নাম…" aria-label="সাইটে খুঁজুন"/><button type="submit">খুঁজুন</button></form>
  {!q&&<div className={styles.hint}><div><strong>সংবাদ</strong><span>শিরোনাম দিয়ে প্রকাশিত সংবাদ খুঁজুন</span></div><div><strong>পরিচিতি</strong><span>প্রার্থী বা স্থানীয় দায়িত্বশীলের নাম লিখুন</span></div><div><strong>এলাকা</strong><span>ইউনিয়ন, পৌরসভা বা এলাকার নাম লিখুন</span></div></div>}
  {q.length===1&&<div className={styles.empty}>কমপক্ষে ২টি অক্ষর লিখে খুঁজুন।</div>}
  {q.length>=2&&<>
   <div className={styles.summary}><strong>“{q}” এর ফলাফল</strong><span>{failed?'কিছু ফলাফল সাময়িকভাবে আনা যায়নি':`${total.toLocaleString('bn-BD')}টি মিল পাওয়া গেছে`}</span></div>
   {!total&&!failed&&<div className={styles.empty}>এই নামে কোনো প্রকাশিত তথ্য পাওয়া যায়নি। বানান বদলে আবার চেষ্টা করুন।</div>}
   {!!posts.length&&<section className={styles.group}><div className={styles.groupHead}><h2>সংবাদ ও প্রকাশনা</h2><span>{posts.length.toLocaleString('bn-BD')}টি</span></div><div className={styles.results}>{posts.map(post=><Link className={styles.result} href={'/posts/'+post.slug} key={post.id}><small>{kinds[post.kind]??'প্রকাশনা'}</small><h3>{post.title}</h3><p>{post.published_at?new Intl.DateTimeFormat('bn-BD',{dateStyle:'medium',timeZone:'Asia/Dhaka'}).format(new Date(post.published_at)):'প্রকাশিত তথ্য'}</p></Link>)}</div></section>}
   {!!profiles.length&&<section className={styles.group}><div className={styles.groupHead}><h2>ব্যক্তি পরিচিতি</h2><span>{profiles.length.toLocaleString('bn-BD')}টি</span></div><div className={styles.results}>{profiles.map(profile=><Link className={styles.result} href={'/profiles/'+profile.slug} key={profile.id}><small>{profile.profile_type==='candidate'?'প্রার্থী পরিচিতি':'স্থানীয় দায়িত্বশীল'}</small><h3>{profile.name}</h3><p>{[profile.designation,profile.area_name||profile.union_name].filter(Boolean).join(' · ')||'বিস্তারিত পরিচিতি'}</p></Link>)}</div></section>}
   {!!areas.length&&<section className={styles.group}><div className={styles.groupHead}><h2>এলাকার তথ্য</h2><span>{areas.length.toLocaleString('bn-BD')}টি</span></div><div className={styles.results}>{areas.map(area=><Link className={styles.result} href={`/areas/${area.upazila}/${area.slug}`} key={area.id}><small>{area.upazila==='daudkandi'?'দাউদকান্দি':'মেঘনা'} · {area.kind==='municipality'?'পৌরসভা':'ইউনিয়ন'}</small><h3>{area.name}</h3><p>{area.description?.slice(0,105)||'এলাকার বিস্তারিত তথ্য দেখুন'}{area.description?.length>105?'…':''}</p></Link>)}</div></section>}
  </>}
 </main>;
}
