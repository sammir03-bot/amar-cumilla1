import type {Metadata} from 'next';
import Section from '../sections/[kind]/page';

const url='https://amar-cumilla1.vercel.app/news';
export const metadata:Metadata={
  title:'কুমিল্লা-১ সংবাদ | দাউদকান্দি ও মেঘনা',
  description:'কুমিল্লা-১ আসনের দাউদকান্দি ও মেঘনা উপজেলার প্রকাশিত সংবাদ, বিবৃতি ও স্থানীয় আপডেট।',
  alternates:{canonical:url},
  openGraph:{type:'website',url,title:'কুমিল্লা-১ সংবাদ | দাউদকান্দি ও মেঘনা',description:'দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ, বিবৃতি ও স্থানীয় আপডেট।'},
};
export const dynamic='force-dynamic';
export default function News({searchParams}:{searchParams:Promise<{page?:string}>}){return <Section params={Promise.resolve({kind:'news'})} searchParams={searchParams}/>;}
