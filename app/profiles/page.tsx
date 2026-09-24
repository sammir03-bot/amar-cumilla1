import Link from 'next/link';
import {getProfiles,profileArea,profilePhoto,type ProfileType} from '../../lib/profiles';
import styles from './profiles.module.css';

export const dynamic='force-dynamic';

export default async function ProfilesPage({searchParams}:{searchParams:Promise<{type?:string}>}){
 const params=await searchParams;
 const type:ProfileType|undefined=params.type==='candidate'||params.type==='responsible'?params.type:undefined;
 const profiles=await getProfiles(type);
 const items=await Promise.all(profiles.map(async profile=>({profile,image:await profilePhoto(profile)})));
 return <main className={styles.page}>
  <section className={styles.hero}><div className={styles.heroInner}><small>People of Cumilla–1</small><h1>{type==='candidate'?'প্রার্থী পরিচিতি':type==='responsible'?'স্থানীয় দায়িত্বশীল':'পরিচিতি'}</h1><p>দাউদকান্দি ও মেঘনার প্রকাশিত প্রার্থী ও স্থানীয় দায়িত্বশীলদের যাচাইকৃত পরিচিতি, দায়িত্ব, এলাকা ও প্রয়োজনীয় তথ্য।</p></div></section>
  <nav className={styles.tabs} aria-label="পরিচিতির ধরন"><Link href="/profiles">সব</Link><Link href="/profiles?type=responsible">স্থানীয় দায়িত্বশীল</Link><Link href="/profiles?type=candidate">প্রার্থী পরিচিতি</Link></nav>
  {items.length?<section className={styles.grid}>{items.map(({profile,image})=><Link href={'/profiles/'+profile.slug} className={styles.card} key={profile.id}><div className={styles.photo}>{image?<img src={image} alt={profile.name}/>:<div className={styles.placeholder}>{profile.name.slice(0,1)}</div>}</div><div className={styles.copy}><small>{profile.profile_type==='candidate'?'প্রার্থী পরিচিতি':'স্থানীয় দায়িত্বশীল'}</small><h2>{profile.name}</h2>{profile.designation&&<strong>{profile.designation}</strong>}<p>{profileArea(profile)||'কুমিল্লা–১'}</p></div></Link>)}</section>:<section className={styles.empty}><h2>এখনও কোনো পরিচিতি প্রকাশ করা হয়নি</h2><p>প্রকাশিত পরিচিতি পাওয়া গেলে এখানে দেখা যাবে।</p></section>}
 </main>;
}
