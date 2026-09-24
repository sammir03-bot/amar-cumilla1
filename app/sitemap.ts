import type {MetadataRoute} from 'next';
import {publicDb} from '../lib/supabase';
import {seoTopics} from '../lib/seo-topics';

export const dynamic='force-dynamic';

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const base='https://amar-cumilla1.vercel.app';
  const staticPages:MetadataRoute.Sitemap=[
    {url:`${base}/`,changeFrequency:'daily',priority:1},
    {url:`${base}/about`,changeFrequency:'monthly',priority:.7},
    {url:`${base}/topics`,changeFrequency:'weekly',priority:.85},
    ...seoTopics.map(topic=>({url:base+topic.path,changeFrequency:'weekly' as const,priority:.85})),
    {url:`${base}/areas`,changeFrequency:'weekly',priority:.9},
    {url:`${base}/news`,changeFrequency:'daily',priority:.9},
    {url:`${base}/profiles`,changeFrequency:'weekly',priority:.8},
    {url:`${base}/editorial-policy`,changeFrequency:'monthly',priority:.6},
    {url:`${base}/privacy`,changeFrequency:'monthly',priority:.5},
    {url:`${base}/sections/event`,changeFrequency:'daily',priority:.8},
    {url:`${base}/sections/leader`,changeFrequency:'weekly',priority:.7},
    {url:`${base}/sections/gallery`,changeFrequency:'weekly',priority:.6},
    {url:`${base}/sections/document`,changeFrequency:'weekly',priority:.7},
    {url:`${base}/contact`,changeFrequency:'monthly',priority:.5},
  ];

  try{
    const db=publicDb();
    const [postsResult,areasResult,profilesResult]=await Promise.all([
      db.from('cumilla_posts').select('slug,updated_at').eq('status','published').lte('published_at',new Date().toISOString()).order('updated_at',{ascending:false}),
      db.from('cumilla_areas').select('upazila,slug,updated_at').eq('published',true).not('verified_at','is',null).order('updated_at',{ascending:false}),
      db.from('cumilla_profiles').select('slug,updated_at').eq('status','published').order('updated_at',{ascending:false}),
    ]);

    const posts=postsResult.error?[]:(postsResult.data??[]);
    const areas=areasResult.error?[]:(areasResult.data??[]);
    const profiles=profilesResult.error?[]:(profilesResult.data??[]);

    const postPages=posts.map(p=>({url:`${base}/posts/${p.slug}`,lastModified:new Date(p.updated_at),changeFrequency:'weekly' as const,priority:.7}));
    const areaPages=areas.map(a=>({url:`${base}/areas/${a.upazila}/${a.slug}`,lastModified:new Date(a.updated_at),changeFrequency:'monthly' as const,priority:.6}));
    const profilePages=profiles.map(p=>({url:`${base}/profiles/${p.slug}`,lastModified:new Date(p.updated_at),changeFrequency:'weekly' as const,priority:.7}));
    return [...staticPages,...postPages,...areaPages,...profilePages];
  }catch{
    return staticPages;
  }
}
