import {NextRequest} from 'next/server';
import {allowedMediaUrl} from '../../lib/remote-media';
const unavailable=()=>new Response('Image unavailable',{status:404,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function GET(request:NextRequest){
 let raw=request.nextUrl.searchParams.get('url')??'';
 try{
  for(let redirects=0;redirects<4;redirects++){
   if(!allowedMediaUrl(raw))return unavailable();
   const target=new URL(raw);
   const response=await fetch(raw,{redirect:'manual',signal:AbortSignal.timeout(12000),headers:{'Accept':'image/avif,image/webp,image/png,image/jpeg','Referer':target.origin+'/'},next:{revalidate:3600}});
   if([301,302,303,307,308].includes(response.status)){
    const location=response.headers.get('location');if(!location)return unavailable();raw=new URL(location,raw).toString();continue;
   }
   const contentType=response.headers.get('content-type')??'';
   if(!response.ok||!response.body||!/^image\/(jpeg|png|webp|gif|avif)(;|$)/i.test(contentType))return unavailable();
   return new Response(response.body,{headers:{'Content-Type':contentType,'Cache-Control':'public, max-age=3600, s-maxage=86400','X-Content-Type-Options':'nosniff'}});
  }
 }catch{/* A missing image must never be replaced with an unrelated photograph. */}
 return unavailable();
}
