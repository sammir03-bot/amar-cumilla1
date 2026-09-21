import {ImageResponse} from 'next/og';

export const size={width:512,height:512};
export const contentType='image/png';

export default function Icon(){
  return new ImageResponse(
    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#063d32'}}>
      <img src="https://amar-cumilla1.vercel.app/logo.svg" width="512" height="512" alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
    </div>,
    {...size},
  );
}
