import type {Metadata} from 'next';
import {getPost} from '../../lib/content';
import {PostView} from '../../components/posts';
export const dynamic='force-dynamic';
export const metadata:Metadata={
  title:'পরিচিতি | কুমিল্লা-১ দাউদকান্দি–মেঘনা',
  description:'বাংলাদেশ জামায়াতে ইসলামী কুমিল্লা-১, দাউদকান্দি–মেঘনা এলাকার প্রকাশিত সাংগঠনিক পরিচিতি ও তথ্য।',
  alternates:{canonical:'https://amar-cumilla1.vercel.app/about'},
};
export default async function About(){const p=await getPost('about');return <section>{p?<PostView post={p}/>:<><h1>আমাদের সম্পর্কে</h1><p>বাংলাদেশ জামায়াতে ইসলামী · কুমিল্লা-১, দাউদকান্দি–মেঘনা।</p><p>সাংগঠনিক পরিচিতি অনুমোদনের পরে এখানে প্রকাশ করা হবে।</p></>}</section>;}
