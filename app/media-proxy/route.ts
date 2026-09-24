import {NextRequest} from 'next/server';
import {allowedMediaUrl} from '../../lib/remote-media';

const unavailable=()=>new Response('Image unavailable',{status:404,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const imageType=/^image\/(jpeg|png|webp|gif|avif)(;|$)/i;
const browserAgent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

function safeReferrer(raw:string){
 if(!raw)return '';
 try{
  const url=new URL(raw);
  return url.protocol==='https:'&&!url.username&&!url.password&&(!url.port||url.port==='443')?url.toString():'';
 }catch{return '';}
}

function requestHeaders(referer:string){
 return {
  'Accept':'image/avif,image/webp,image/apng,image/png,image/jpeg,image/gif;q=0.9,*/*;q=0.5',
  'Accept-Language':'bn-BD,bn;q=0.9,en-US;q=0.8,en;q=0.7',
  'User-Agent':browserAgent,
  ...(referer?{'Referer':referer}:{}),
 };
}

export async function GET(request:NextRequest){
 let raw=request.nextUrl.searchParams.get('url')??'';
 const sourceRef=safeReferrer(request.nextUrl.searchParams.get('ref')??'');
 for(let redirects=0;redirects<4;redirects++){
  if(!allowedMediaUrl(raw))return unavailable();
  const target=new URL(raw);
  const referrers=[...new Set([sourceRef,target.origin+'/', ''])];
  let redirected=false;
  for(const referer of referrers){
   let response:Response;
   try{
    response=await fetch(raw,{redirect:'manual',signal:AbortSignal.timeout(7000),headers:requestHeaders(referer),next:{revalidate:3600}});
   }catch{continue;}
   if([301,302,303,307,308].includes(response.status)){
    const location=response.headers.get('location');
    if(!location){await response.body?.cancel();continue;}
    const next=new URL(location,raw).toString();
    await response.body?.cancel();
    if(!allowedMediaUrl(next))return unavailable();
    raw=next;redirected=true;break;
   }
   const contentType=response.headers.get('content-type')??'';
   if(response.ok&&response.body&&imageType.test(contentType)){
    return new Response(response.body,{headers:{'Content-Type':contentType,'Cache-Control':'public, max-age=3600, s-maxage=86400','X-Content-Type-Options':'nosniff'}});
   }
   await response.body?.cancel();
  }
  if(!redirected)return unavailable();
 }
 return unavailable();
}
