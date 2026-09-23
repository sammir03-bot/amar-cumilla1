import type {Metadata} from 'next';
import CommunityForm from '../../components/community-form';

export const metadata:Metadata={title:'এলাকার সমস্যা জানান | আমার কুমিল্লা এক',description:'দাউদকান্দি ও মেঘনার স্থানীয় সমস্যা, জনদুর্ভোগ ও সেবাসংক্রান্ত বিষয় জানানোর ফর্ম।'};

export default async function ProblemPage({searchParams}:{searchParams:Promise<{sent?:string;error?:string}>}){
  const q=await searchParams;
  return <CommunityForm
    kind="problem"
    kicker="এলাকার সমস্যা"
    title="আপনার এলাকার সমস্যা আমাদের জানান"
    description="রাস্তা, পানি, ড্রেনেজ, শিক্ষা, স্বাস্থ্য, জননিরাপত্তা বা অন্য স্থানীয় সমস্যা বিস্তারিত লিখুন। তথ্য Admin Panel-এ যাবে এবং পর্যালোচনার জন্য সংরক্ষিত থাকবে।"
    subjectLabel="সমস্যার শিরোনাম"
    subjectPlaceholder="যেমন: রাস্তা ভাঙা / ড্রেনেজ সমস্যা"
    messageLabel="সমস্যার বিস্তারিত"
    messagePlaceholder="কোথায়, কতদিন ধরে, কী ধরনের সমস্যা—যতটা সম্ভব পরিষ্কারভাবে লিখুন…"
    button="সমস্যা জমা দিন"
    sent={q.sent==='1'}
    error={q.error==='1'}
  />;
}
