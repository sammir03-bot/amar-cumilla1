import Link from 'next/link';
import {upazilaNames} from '../../lib/areas';
import {getAreas} from '../../lib/content';
export const dynamic='force-dynamic';
export const metadata = {title:'আমাদের এলাকা'};
export default async function Areas({searchParams}:{searchParams:Promise<{q?:string;upazila?:string}>}) {
  const {q='',upazila=''}=await searchParams;
  const areas=await getAreas();
  const results=areas.filter(a=>(!upazila||a.upazila===upazila)&&a.name.normalize().includes(q.trim().normalize()));
  return <section><p className="eyebrow">এলাকার তথ্যভান্ডার</p><h1>আমাদের এলাকা</h1><p>উপজেলা বেছে নিন অথবা নাম দিয়ে আপনার ইউনিয়ন খুঁজুন।</p><aside className="notice">এখানে যাচাই করে প্রকাশ করা এলাকার তথ্য দেখানো হয়।</aside><form className="filters"><label>এলাকার নাম<input name="q" defaultValue={q} placeholder="যেমন: গৌরীপুর" maxLength={100}/></label><label>উপজেলা<select name="upazila" defaultValue={upazila}><option value="">সব উপজেলা</option><option value="daudkandi">দাউদকান্দি</option><option value="meghna">মেঘনা</option></select></label><button>খুঁজুন</button><Link href="/areas">সব দেখুন</Link></form><div className="grid">{results.map(a=><Link className="card" href={`/areas/${a.upazila}/${a.slug}`} key={`${a.upazila}/${a.slug}`}><span className="eyebrow">{upazilaNames[a.upazila]} · {a.kind==='municipality'?'পৌরসভা':'ইউনিয়ন'}</span><h2>{a.name}</h2><p>পরিচিতি ও তথ্যসূত্র →</p></Link>)}</div>{!results.length&&<p className="notice">প্রকাশিত তালিকায় কোনো এলাকা পাওয়া যায়নি। তথ্য যাচাই ও প্রকাশের কাজ চলছে।</p>}</section>;
}
