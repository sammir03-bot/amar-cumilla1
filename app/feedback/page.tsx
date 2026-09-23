import type {Metadata} from 'next';
import CommunityForm from '../../components/community-form';

export const metadata:Metadata={title:'মতামত ও পরামর্শ | আমার কুমিল্লা এক',description:'দাউদকান্দি ও মেঘনার মানুষদের মতামত, পরামর্শ ও স্থানীয় উন্নয়ন ভাবনা জানানোর ফর্ম।'};

export default async function FeedbackPage({searchParams}:{searchParams:Promise<{sent?:string;error?:string}>}){
  const q=await searchParams;
  return <CommunityForm
    kind="feedback"
    kicker="মতামত ও পরামর্শ"
    title="আপনার মতামত, পরামর্শ ও উন্নয়ন ভাবনা লিখুন"
    description="সাইট, স্থানীয় কার্যক্রম, জনসেবা বা এলাকার উন্নয়ন নিয়ে আপনার গঠনমূলক মতামত এখানে পাঠাতে পারেন।"
    subjectLabel="মতামতের বিষয়"
    subjectPlaceholder="যেমন: শিক্ষা / স্বাস্থ্য / সাইটের উন্নয়ন"
    messageLabel="আপনার মতামত বা পরামর্শ"
    messagePlaceholder="আপনার কথা বিস্তারিত লিখুন…"
    button="মতামত জমা দিন"
    sent={q.sent==='1'}
    error={q.error==='1'}
  />;
}
