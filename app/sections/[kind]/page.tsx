import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getPosts,kinds} from '../../../lib/content';
import {PostCards} from '../../../components/posts';

export const dynamic='force-dynamic';

export async function generateMetadata({params}:{params:Promise<{kind:string}>}):Promise<Metadata>{
 const {kind}=await params;
 if(!Object.hasOwn(kinds,kind))return {title:'পাতা পাওয়া যায়নি',robots:{index:false,follow:false}};
 const title=`${kinds[kind]} | কুমিল্লা-১`;
 const description=`দাউদকান্দি ও মেঘনার প্রকাশিত ${kinds[kind]} এবং সংশ্লিষ্ট স্থানীয় তথ্য।`;
 const url=kind==='news'?'https://amar-cumilla1.vercel.app/news':`https://amar-cumilla1.vercel.app/sections/${kind}`;
 return {title,description,alternates:{canonical:url},openGraph:{type:'website',url,title,description}};
}

export default async function Section({params,searchParams}:{params:Promise<{kind:string}>;searchParams:Promise<{page?:string}>}){
 const {kind}=await params;
 if(!Object.hasOwn(kinds,kind))notFound();
 const page=Math.max(1,Math.floor(Number((await searchParams).page)||1));
 const {posts,count}=await getPosts(kind,undefined,page);
 return <section><h1>{kinds[kind]}</h1><PostCards posts={posts}/><nav className="pagination">{page>1&&<Link href={'?page='+(page-1)}>← আগের পাতা</Link>}{page*12<count&&<Link href={'?page='+(page+1)}>পরের পাতা →</Link>}</nav></section>;
}
