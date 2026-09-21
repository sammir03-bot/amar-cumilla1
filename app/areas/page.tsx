import type {Metadata} from 'next';
import Link from 'next/link';
import {upazilaNames} from '../../lib/areas';
import {getAreas} from '../../lib/content';
import styles from './areas.module.css';

export const dynamic='force-dynamic';
export const metadata:Metadata={
  title:'দাউদকান্দি ও মেঘনা এলাকার তথ্য | কুমিল্লা-১',
  description:'কুমিল্লা-১ আসনের দাউদকান্দি ও মেঘনা উপজেলার ইউনিয়ন, পৌরসভা, স্থানীয় প্রতিষ্ঠান, সেবা ও যাচাইকৃত এলাকার তথ্য।',
  alternates:{canonical:'https://amar-cumilla1.vercel.app/areas'},
};

export default async function Areas({searchParams}:{searchParams:Promise<{q?:string;upazila?:string}>}) {
  const {q='',upazila=''}=await searchParams;
  const areas=await getAreas();
  const results=areas.filter(a=>(!upazila||a.upazila===upazila)&&a.name.normalize().includes(q.trim().normalize()));
  const daudkandi=areas.filter(a=>a.upazila==='daudkandi').length;
  const meghna=areas.filter(a=>a.upazila==='meghna').length;
  const featured=results.find(a=>a.image_url)??results[0];

  return <div className={styles.page}>
    <div className={styles.top}><div><p className="eyebrow">কুমিল্লা-১ এলাকার তথ্যভান্ডার</p><h1>দাউদকান্দি ও মেঘনার এলাকা</h1><p>ইউনিয়ন, পৌরসভা, শিক্ষা প্রতিষ্ঠান, স্থানীয় সেবা ও যাচাইকৃত পরিচিতি—এক জায়গায়।</p></div><span className={styles.count}>মোট {areas.length} প্রকাশিত এলাকা</span></div>

    {featured&&<Link className={styles.listHero} href={`/areas/${featured.upazila}/${featured.slug}`}>
      {featured.image_url?<img className={styles.listImage} src={featured.image_url} alt={`${featured.name} এলাকার দৃশ্য`}/>:<div className={styles.listImageFallback}/>} 
      <div className={styles.listCopy}><small>{upazilaNames[featured.upazila]} · {featured.kind==='municipality'?'পৌরসভা':'ইউনিয়ন'}</small><h2>{featured.name}</h2><p>{featured.description.split('\n')[0]}</p></div>
    </Link>}

    <div className={styles.notice}>দাউদকান্দি: {daudkandi}টি প্রকাশিত এলাকা · মেঘনা: {meghna}টি প্রকাশিত এলাকা। তথ্য সরকারি/প্রাথমিক উৎস মিলিয়ে প্রকাশ করা হয়।</div>

    <div className={styles.filtersWrap}><form className="filters"><label>এলাকার নাম<input name="q" defaultValue={q} placeholder="যেমন: গৌরীপুর" maxLength={100}/></label><label>উপজেলা<select name="upazila" defaultValue={upazila}><option value="">সব উপজেলা</option><option value="daudkandi">দাউদকান্দি</option><option value="meghna">মেঘনা</option></select></label><button>খুঁজুন</button><Link href="/areas">সব দেখুন</Link></form></div>

    {results.length?<div className={styles.areaGrid}>{results.map(a=><Link className={styles.areaCard} href={`/areas/${a.upazila}/${a.slug}`} key={`${a.upazila}/${a.slug}`}>
      {a.image_url?<img className={styles.thumb} src={a.image_url} alt={`${a.name} এলাকার দৃশ্য`} loading="lazy"/>:<div className={styles.thumbFallback}/>} 
      <div className={styles.cardCopy}><small>{upazilaNames[a.upazila]} · {a.kind==='municipality'?'পৌরসভা':'ইউনিয়ন'}</small><h2>{a.name}</h2><p>পরিচিতি, শিক্ষা, সেবা ও তথ্যসূত্র →</p></div>
    </Link>)}</div>:<div className={styles.empty}>প্রকাশিত তালিকায় কোনো এলাকা পাওয়া যায়নি। অন্য নাম দিয়ে খুঁজুন।</div>}
  </div>;
}
