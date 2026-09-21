import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {upazilaNames} from '../../../../lib/areas';
import {getAreas,getPosts} from '../../../../lib/content';
import {PostCards} from '../../../../components/posts';
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
  return {title,description,alternates:{canonical:url},openGraph:{type:'website',url,title,description}};
}

export default async function Area({params}:Props){const p=await params;const a=(await getAreas()).find(a=>a.upazila===p.upazila&&a.slug===p.slug);if(!a)notFound();const {posts}=await getPosts(undefined,a.upazila+'/'+a.slug);return <section><Link href={'/areas?upazila='+a.upazila}>← {upazilaNames[a.upazila]} উপজেলার এলাকা</Link><h1>{a.name}</h1><div className="grid two">{[[a.description,'পরিচিতি'],[a.villages,'গ্রাম ও ওয়ার্ড'],[a.institutions,'শিক্ষাপ্রতিষ্ঠান ও গুরুত্বপূর্ণ স্থান'],[a.services,'জনসেবার তথ্য']].map(([text,title])=>text?<article className="card" key={title}><h2>{title}</h2><div className="body-text">{text}</div></article>:null)}</div>{a.source_url&&<p><a href={a.source_url} target="_blank" rel="noopener noreferrer">তথ্যসূত্র ↗</a></p>}<h2>এলাকার সংবাদ ও কার্যক্রম</h2><PostCards posts={posts}/></section>;}
