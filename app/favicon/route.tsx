import {ImageResponse} from 'next/og';

export const runtime='edge';

export async function GET(request:Request){
  const origin=new URL(request.url).origin;
  return new ImageResponse(
    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#ffffff'}}>
      <img src={`${origin}/logo.svg`} width="512" height="512" alt="" style={{width:'512px',height:'512px',objectFit:'contain'}}/>
    </div>,
    {
      width:512,
      height:512,
      headers:{
        'Cache-Control':'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
        'Content-Type':'image/png',
        'X-Content-Type-Options':'nosniff',
      },
    },
  );
}
