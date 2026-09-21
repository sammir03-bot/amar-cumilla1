import Link from 'next/link';
import {getPosts} from '../lib/content';
import {PostCards} from '../components/posts';
export const dynamic='force-dynamic';
export default async function Home() {
  const {posts}=await getPosts('news');
  return <>
    <section className="hero"><div className="eyebrow">কুমিল্লা–১ / দাউদকান্দি–মেঘনা</div><h1>আমাদের এলাকা।<br/>এক ঠিকানায় তথ্য।</h1><p>এলাকার পরিচিতি, স্থানীয় সংবাদ ও প্রকাশিত কার্যক্রমের জন্য একটি সহজ তথ্যভান্ডার।</p><Link className="button" href="/areas">আপনার এলাকা খুঁজুন ↗</Link><div className="hero-bottom">বাংলাদেশ জামায়াতে ইসলামী <span>প্রস্তুতিমূলক সংস্করণ</span></div></section>
    <section><div className="section-head"><div><p className="eyebrow">আমাদের এলাকা</p><h2>দুই উপজেলার পরিচিতি</h2></div><Link href="/areas">সব এলাকা দেখুন →</Link></div><div className="grid two">
    {[['daudkandi','দাউদকান্দি','ইউনিয়ন ও পৌরসভার পরিচিতি'],['meghna','মেঘনা','ইউনিয়নগুলোর পরিচিতি']].map(([slug,title,desc])=><Link className="area-feature" href={`/areas?upazila=${slug}`} key={slug}><span className="eyebrow">উপজেলা</span><h3>{title}</h3><p>{desc}</p><span>এলাকা দেখুন ↗</span></Link>)}
    </div></section><section className="section-head"><div><p className="eyebrow">সংবাদ ও কার্যক্রম</p><h2>যাচাইকৃত তথ্যই প্রকাশিত হবে</h2><p>সম্পাদকের অনুমোদনের পরে নতুন সংবাদ এখানে পাওয়া যাবে।</p></div><Link className="button secondary" href="/news">সংবাদ বিভাগ →</Link></section>
    <section><h2>সর্বশেষ সংবাদ</h2><PostCards posts={posts.slice(0,3)}/></section>
  </>;
}
