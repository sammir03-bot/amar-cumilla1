import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getPost,kinds} from '../../../lib/content';
import {PostView} from '../../../components/posts';
export const dynamic='force-dynamic';
const siteUrl='https://amar-cumilla1.vercel.app';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const p=await getPost(slug);
  if(!p)return {title:'প্রকাশনা পাওয়া যায়নি',robots:{index:false,follow:false}};
  const url=`${siteUrl}/posts/${p.slug}`;
  const description=p.body.replace(/\s+/g,' ').trim().slice(0,155) || 'কুমিল্লা-১, দাউদকান্দি ও মেঘনার প্রকাশিত তথ্য।';
  return {
    title:p.title,
    description,
    alternates:{canonical:url},
    openGraph:{type:'article',url,title:p.title,description,publishedTime:p.published_at??undefined,modifiedTime:p.updated_at},
  };
}

export default async function Post({params}:{params:Promise<{slug:string}>}){
  const p=await getPost((await params).slug);
  if(!p)notFound();
  const url=`${siteUrl}/posts/${p.slug}`;
  const description=p.body.replace(/\s+/g,' ').trim().slice(0,180) || 'কুমিল্লা-১, দাউদকান্দি ও মেঘনার প্রকাশিত তথ্য।';
  const schema={
    '@context':'https://schema.org',
    '@type':p.kind==='news'?'NewsArticle':'Article',
    headline:p.title,
    description,
    datePublished:p.published_at??p.created_at,
    dateModified:p.updated_at,
    mainEntityOfPage:{'@type':'WebPage','@id':url},
    articleSection:kinds[p.kind]??p.kind,
    inLanguage:'bn-BD',
    publisher:{'@type':'Organization',name:'Amar Cumilla–1',url:siteUrl,logo:{'@type':'ImageObject',url:`${siteUrl}/favicon`}},
  };
  const json=JSON.stringify(schema).replace(/</g,'\\u003c');
  return <section><script type="application/ld+json" dangerouslySetInnerHTML={{__html:json}}/><PostView post={p}/></section>;
}
