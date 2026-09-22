import chunk0 from '../../lib/home-hero-chunk-00';
import chunk1 from '../../lib/home-hero-chunk-01';
import chunk2 from '../../lib/home-hero-chunk-02';
import chunk3 from '../../lib/home-hero-chunk-03';
import chunk4 from '../../lib/home-hero-chunk-04';
import chunk5 from '../../lib/home-hero-chunk-05';
import chunk6 from '../../lib/home-hero-chunk-06';

export const runtime='nodejs';
export const dynamic='force-static';

export async function GET(){
  const data=Buffer.from(chunk0+chunk1+chunk2+chunk3+chunk4+chunk5+chunk6,'base64');
  return new Response(data,{
    status:200,
    headers:{
      'Content-Type':'image/webp',
      'Cache-Control':'public, max-age=31536000, immutable',
      'Content-Length':String(data.length),
      'X-Content-Type-Options':'nosniff',
    },
  });
}
