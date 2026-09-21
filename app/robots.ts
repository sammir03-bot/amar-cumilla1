import type {MetadataRoute} from 'next';

export default function robots():MetadataRoute.Robots{
  const base='https://amar-cumilla1.vercel.app';
  return {
    rules:[
      {userAgent:'*',allow:'/',disallow:['/admin/','/login']},
    ],
    sitemap:`${base}/sitemap.xml`,
    host:base,
  };
}
