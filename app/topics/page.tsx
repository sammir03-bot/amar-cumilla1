import type {Metadata} from 'next';
import Link from 'next/link';
import {seoTopics} from '../../lib/seo-topics';
import styles from '../../components/seo-topic-page.module.css';

const url='https://amar-cumilla1.vercel.app/topics';
export const metadata:Metadata={
  title:'বিষয়ভিত্তিক তথ্য | কুমিল্লা–১, দাউদকান্দি ও মেঘনা',
  description:'কুমিল্লা–১, দাউদকান্দি, মেঘনা, জামায়াতে ইসলামী সম্পর্কিত স্থানীয় তথ্য ও দাঁড়িপাল্লা বিষয়ক প্রকাশিত তথ্য দ্রুত খুঁজুন।',
  alternates:{canonical:url},
};

export default function Topics(){
  return <section className={styles.page} aria-labelledby="topics-title"><nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">হোম</Link><span>›</span><b>বিষয়ভিত্তিক তথ্য</b></nav><header className={styles.hero}><span className={styles.kicker}>TOPIC INDEX</span><h1 id="topics-title">একই তথ্য মানুষ যেভাবেই খুঁজুক, পরিষ্কার বিষয়ের মাধ্যমে পৌঁছাক</h1><p>দাউদকান্দি, মেঘনা, কুমিল্লা–১ এবং সংশ্লিষ্ট প্রকাশিত তথ্যকে আলাদা বিষয়ভিত্তিক প্রবেশপথে সাজানো হয়েছে। বাংলা ও ইংরেজির প্রচলিত নাম/বানানের ভিন্নতাও প্রতিটি পাতায় দেখানো আছে।</p></header><div className={styles.cards}>{seoTopics.map(topic=><Link className={styles.card} href={topic.path} key={topic.slug}><strong>{topic.label}</strong><p>{topic.description}</p><b>বিষয়টি দেখুন →</b></Link>)}</div><section className={styles.note}><strong>কেন আলাদা বিষয়ভিত্তিক পাতা?</strong><p>প্রতিটি বানানের জন্য কৃত্রিমভাবে আলাদা পাতা তৈরি না করে একই অর্থের অনুসন্ধানকে একটি পূর্ণাঙ্গ canonical পাতার সঙ্গে যুক্ত করা হয়েছে। এতে ব্যবহারকারী ও সার্চ ইঞ্জিন—দুজনের কাছেই সাইটের কাঠামো পরিষ্কার থাকে।</p></section></section>;
}
