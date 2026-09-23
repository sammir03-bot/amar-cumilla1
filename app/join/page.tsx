import type {Metadata} from 'next';
import CommunityForm from '../../components/community-form';

export const metadata:Metadata={title:'যোগদানের আগ্রহ | আমার কুমিল্লা এক',description:'দাউদকান্দি ও মেঘনা এলাকায় বাংলাদেশ জামায়াতে ইসলামী সম্পর্কে জানতে বা যুক্ত হওয়ার আগ্রহ জানাতে ফর্ম।'};

export default async function JoinPage({searchParams}:{searchParams:Promise<{sent?:string;error?:string}>}){
  const q=await searchParams;
  return <CommunityForm
    kind="join"
    kicker="যোগ দিন"
    title="বাংলাদেশ জামায়াতে ইসলামী সম্পর্কে জানতে ও যুক্ত হওয়ার আগ্রহ জানান"
    description="এই ফর্মটি সরাসরি সদস্যপদ অনুমোদন নয়। আপনার আগ্রহ ও যোগাযোগের তথ্য দায়িত্বশীলদের কাছে পৌঁছাবে; প্রয়োজন হলে তারা পরবর্তী ধাপ সম্পর্কে যোগাযোগ করবেন।"
    subjectLabel="সংক্ষিপ্ত পরিচয় / আগ্রহের ক্ষেত্র"
    subjectPlaceholder="ঐচ্ছিক"
    messageLabel="আপনি কীভাবে যুক্ত হতে চান বা কী জানতে চান?"
    messagePlaceholder="সংক্ষেপে লিখুন…"
    button="আগ্রহ জমা দিন"
    sent={q.sent==='1'}
    error={q.error==='1'}
  />;
}
