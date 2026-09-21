import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getPosts,kinds} from '../../../lib/content';
import {PostCards} from '../../../components/posts';
export const dynamic='force-dynamic';
export default async function Section({params,searchParams}:{params:Promise<{kind:string}>;searchParams:Promise<{page?:string}>}){const {kind}=await params;if(!Object.hasOwn(kinds,kind))notFound();const page=Math.max(1,Math.floor(Number((await searchParams).page)||1));const {posts,count}=await getPosts(kind,undefined,page);return <section><h1>{kinds[kind]}</h1><PostCards posts={posts}/><nav className="pagination">{page>1&&<Link href={'?page='+(page-1)}>← আগের পাতা</Link>}{page*12<count&&<Link href={'?page='+(page+1)}>পরের পাতা →</Link>}</nav></section>;}
