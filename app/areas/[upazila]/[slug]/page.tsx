import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {upazilaNames} from '../../../../lib/areas';
import {getAreas,getPosts} from '../../../../lib/content';
import {PostCards} from '../../../../components/posts';
import styles from '../../areas.module.css';

export const dynamic='force-dynamic';
type Props={params:Promise<{upazila:string;slug:string}>};

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const p=await params;
  const a=(await getAreas()).find(a=>a.upazila===p.upazila&&a.slug===p.slug);
  if(!a)return {title:'এলাকা পাওয়া যায়নি',robots:{index:false,follow:false}};
  const upazila=upazilaNames[a.upazila]??a.upazila;
  const title=`${a.name} | ${upazila}, কুমিল্লা-১`;
  const description=(a.description||`${a.name}, ${upazila} উপজেলার পরিচিতি, স্থানীয় তথ্য, প্রতিষ্ঠান ও সেবাসংক্রান্ত প্রকাশিত তথ্য।`).replace(/\s+/g,' ').trim().slice(0,155);
  const url=`https://amar-cumilla1.vercel.app/areas/${a.upazila}/${a.slug}`;
  return {title,description,alternates:{canonical:url},openGraph:{type:'website',url,title,description,images:a.image_url?[{url:a.image_url,alt:`${a.name} এলাকার ছবি`}]:undefined}};
}

export default async function Area({params}:Props){
  const p=await params;
  const a=(await getAreas()).find(a=>a.upazila===p.upazila&&a.slug===p.slug);
  if(!a)notFound();
  const areaKey=a.upazila+'/'+a.slug;
  const [{posts},{posts:leaders}]=await Promise.all([getPosts(undefined,areaKey),getPosts('leader',areaKey)]);
  const sortedLeaders=[...leaders].sort((x,y)=>{
    const xLocal=x.area_keys?.length===1&&x.area_keys[0]===areaKey?0:1;
    const yLocal=y.area_keys?.length===1&&y.area_keys[0]===areaKey?0:1;
    if(xLocal!==yLocal)return xLocal-yLocal;
    return new Date(y.published_at??0).valueOf()-new Date(x.published_at??0).valueOf();
  });
  const upazila=upazilaNames[a.upazila]??a.upazila;
  const sections=[[a.description,'পরিচিতি'],[a.villages,'গ্রাম ও ওয়ার্ড'],[a.institutions,'শিক্ষাপ্রতিষ্ঠান ও গুরুত্বপূর্ণ স্থান'],[a.services,'জনসেবার তথ্য']] as const;

  return <div className={styles.page}>
    <div className={styles.top}><Link className={styles.back} href={'/areas?upazila='+a.upazila}>← {upazila} উপজেলার সব এলাকা</Link><span className={styles.count}>{a.kind==='municipality'?'পৌরসভা':'ইউনিয়ন'} · যাচাইকৃত তথ্য</span></div>

    <section className={styles.hero}>
      {a.image_url?<img className={styles.heroImage} src={a.image_url} alt={`${a.name} এলাকার দৃশ্য`}/>:<div className={styles.heroFallback}/>}<div className={styles.heroShade}/>
      {a.image_url&&a.image_credit&&<div className={styles.credit}>ছবি: {a.image_credit}{a.image_license?` · ${a.image_license}`:''}{a.image_source_url&&<> · <a href={a.image_source_url} target="_blank" rel="noopener noreferrer">উৎস</a></>}</div>}
      <div className={styles.heroCopy}><small>কুমিল্লা-১ · {upazila}</small><h1>{a.name}</h1><p>{a.description.split('\n')[0]}</p></div>
    </section>

    <div className={styles.grid}>{sections.map(([text,title])=>text?<article className={styles.info} key={title}><h2>{title}</h2><div className={styles.infoText}>{text}</div></article>:null)}</div>

    {a.source_url&&<div className={styles.sourceBox}><div><strong>সরকারি/প্রাথমিক তথ্যসূত্র</strong><span>তথ্য পরিবর্তিত হতে পারে—সর্বশেষ অবস্থা উৎস পেজে যাচাই করুন।</span></div><a href={a.source_url} target="_blank" rel="noopener noreferrer">অফিসিয়াল উৎস দেখুন ↗</a></div>}

    {sortedLeaders.length>0&&<section className={styles.news}><div className={styles.newsHead}><div><p className="eyebrow">সাংগঠনিক পরিচিতি</p><h2>এই এলাকার সঙ্গে সংশ্লিষ্ট নেতৃত্ব</h2><p>ইউনিয়ন/পৌরসভাভিত্তিক পরিচিতিকে আগে দেখানো হয়, এরপর উপজেলা পর্যায়ের সংশ্লিষ্ট নেতৃত্ব।</p></div></div><PostCards posts={sortedLeaders.slice(0,6)}/></section>}

    <section className={styles.news}><div className={styles.newsHead}><div><p className="eyebrow">স্থানীয় আপডেট</p><h2>এই এলাকার সংবাদ ও কার্যক্রম</h2></div></div><PostCards posts={posts}/></section>
  </div>;
}
