export const metadata={title:'সংবাদ ও বিবৃতি'};
import Section from '../sections/[kind]/page';
export const dynamic='force-dynamic';
export default function News({searchParams}:{searchParams:Promise<{page?:string}>}){return <Section params={Promise.resolve({kind:'news'})} searchParams={searchParams}/>;}
