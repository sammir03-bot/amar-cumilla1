import type {MetadataRoute} from 'next';
import {publicDb} from '../lib/supabase';

export const dynamic='force-dynamic';

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const base='https://amar-cumilla1.vercel.app';
  const now=new Date();
  const staticPages:MetadataRoute.Sitemap=[
    {url:`${base}/`,lastModified:now,changeFrequency:'daily',priority:1},
    {url:`${base}/about`,lastModified:now,changeFrequency:'monthly',priority:.7},
    {url:`${base}/areas`,lastModified:now,changeFrequency:'weekly',priority:.9},
    {url:`${base}/news`,lastModified:now,changeFrequency:'daily',priority:.9},
    {url:`${base}/sections/event`,lastModified:now,changeFrequency:'daily',priority:.8},
    {url:`${base}/sections/leader`,lastModified:now,changeFrequency:'weekly',priority:.7},
    {url:`${base}/sections/gallery`,lastModified:now,changeFrequency:'weekly',priority:.6},
    {url:`${base}/sections/document`,lastModified:now,changeFrequency:'weekly',priority:.7},
    {url:`${base}/contact`,lastModified:now,changeFrequency:'monthly',priority:.5},
  ];

  try{
    const db=publicDb();
    const [{data:posts},{data:areas}]=await Promise.all([
      db.from('cumilla_posts').select('slug,updated_at').eq('status','published').lte('published_at',new Date().toISOString()).order('updated_at',{ascending:false}),
      db.from('cumilla_areas').select('upazila,slug,updated_at').eq('published',true).not('verified_at','is',null).order('updated_at',{ascending:false}),
    ]);
    const postPages=(posts??[]).map(p=>({url:`${base}/posts/${p.slug}`,lastModified:new Date(p.updated_at),changeFrequency:'weekly' as const,priority:.7}));
    const areaPages=(areas??[]).map(a=>({url:`${base}/areas/${a.upazila}/${a.slug}`,lastModified:new Date(a.updated_at),changeFrequency:'monthly' as const,priority:.6}));
    return [...staticPages,...postPages,...areaPages];
  }catch{
    return staticPages;
  }
}
