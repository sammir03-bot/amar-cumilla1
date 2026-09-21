import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getPost} from '../../../lib/content';
import {PostView} from '../../../components/posts';
export const dynamic='force-dynamic';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const p=await getPost(slug);
  if(!p)return {title:'প্রকাশনা পাওয়া যায়নি',robots:{index:false,follow:false}};
  const url=`https://amar-cumilla1.vercel.app/posts/${p.slug}`;
  const description=p.body.replace(/\s+/g,' ').trim().slice(0,155) || 'কুমিল্লা-১, দাউদকান্দি ও মেঘনার প্রকাশিত তথ্য।';
  return {
    title:p.title,
    description,
    alternates:{canonical:url},
    openGraph:{type:'article',url,title:p.title,description,publishedTime:p.published_at??undefined,modifiedTime:p.updated_at},
  };
}

export default async function Post({params}:{params:Promise<{slug:string}>}){const p=await getPost((await params).slug);if(!p)notFound();return <section><PostView post={p}/></section>;}
