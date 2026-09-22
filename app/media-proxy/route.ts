import {NextRequest} from 'next/server';

const allowedHosts=new Set([
  'www.dailyjanakantha.com',
  'www.shomoyeralo.com',
  'www.bssnews.net',
  'static.dailysangram.com',
  'thebangladeshtoday.com',
  'commons.wikimedia.org',
]);

function fallback(request:NextRequest){
  return Response.redirect(new URL('/logo.svg',request.url),302);
}

export async function GET(request:NextRequest){
  const raw=request.nextUrl.searchParams.get('url');
  if(!raw)return fallback(request);

  let target:URL;
  try{target=new URL(raw);}catch{return fallback(request);}
  if(target.protocol!=='https:'||!allowedHosts.has(target.hostname))return fallback(request);

  try{
    const response=await fetch(target.toString(),{
      redirect:'follow',
      headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
        'Accept':'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer':`${target.protocol}//${target.hostname}/`,
      },
      next:{revalidate:86400},
    });
    if(!response.ok||!response.body)return fallback(request);
    const contentType=response.headers.get('content-type')||'';
    if(!contentType.startsWith('image/'))return fallback(request);
    return new Response(response.body,{
      status:200,
      headers:{
        'Content-Type':contentType,
        'Cache-Control':'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
        'X-Content-Type-Options':'nosniff',
      },
    });
  }catch{
    return fallback(request);
  }
}
