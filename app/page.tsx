import Link from 'next/link';
import {getPosts} from '../lib/content';
import {PostCards} from '../components/posts';
import styles from './home.module.css';

export const dynamic = 'force-dynamic';

const shortcuts = [
  {href:'/areas',label:'এলাকা পরিচিতি',meta:'ইউনিয়ন ও পৌরসভা',icon:'⌖'},
  {href:'/news',label:'সর্বশেষ সংবাদ',meta:'প্রকাশিত কনটেন্ট',icon:'↗'},
  {href:'/sections/event',label:'কর্মসূচি',meta:'তারিখ, সময় ও স্থান',icon:'◷'},
  {href:'/sections/leader',label:'নেতৃত্ব',meta:'প্রকাশিত পরিচিতি',icon:'◎'},
];

export default async function Home(){
  const {posts}=await getPosts('news');

  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.heroGlow} aria-hidden="true"/>

      <div className={styles.heroCopy}>
        <div className={styles.kicker}><span className={styles.kickerDot}/> কুমিল্লা–১ · দাউদকান্দি — মেঘনা</div>
        <h1 id="home-title">স্থানীয় তথ্য,<span>এক জায়গায় সহজভাবে।</span></h1>
        <p className={styles.heroLead}>এলাকা পরিচিতি, প্রকাশিত সংবাদ, কর্মসূচি ও সাংগঠনিক তথ্য—পরিষ্কার কাঠামোতে, দ্রুত খুঁজে দেখার জন্য।</p>

        <div className={styles.heroActions}>
          <Link className={styles.primaryAction} href="/areas">এলাকা দেখুন <span>↗</span></Link>
          <Link className={styles.secondaryAction} href="/news">সর্বশেষ সংবাদ <span>→</span></Link>
        </div>

        <div className={styles.heroMeta}>
          <span><i/> প্রকাশিত তথ্য আলাদা রাখা হয়</span>
          <span><i/> মোবাইল ও ডেস্কটপে দ্রুত ব্যবহার</span>
        </div>
      </div>

      <aside className={styles.controlCard} aria-label="দ্রুত প্রবেশ">
        <div className={styles.controlTop}>
          <div className={styles.controlTitle}><strong>দ্রুত প্রবেশ</strong><small>প্রধান বিভাগগুলো এক নজরে</small></div>
          <span className={styles.live}><i/> তথ্যকেন্দ্র</span>
        </div>

        <div className={styles.controlGrid}>
          <div className={styles.metric}><strong>০২</strong><span>উপজেলা</span></div>
          <div className={styles.metric}><strong>২৪</strong><span>এলাকার রেকর্ড</span></div>
        </div>

        <div className={styles.quickList}>
          {shortcuts.map(item=><Link className={styles.quick} href={item.href} key={item.href}>
            <span className={styles.quickIcon} aria-hidden="true">{item.icon}</span>
            <span className={styles.quickCopy}><strong>{item.label}</strong><small>{item.meta}</small></span>
            <span className={styles.quickArrow} aria-hidden="true">→</span>
          </Link>)}
        </div>
      </aside>
    </section>

    <nav className={styles.signalBar} aria-label="প্রধান বিভাগ">
      <Link href="/areas?upazila=daudkandi"><i/>দাউদকান্দি</Link>
      <Link href="/areas?upazila=meghna"><i/>মেঘনা</Link>
      <Link href="/news"><i/>সংবাদ</Link>
      <Link href="/sections/event"><i/>কর্মসূচি</Link>
      <Link href="/sections/document"><i/>প্রকাশনা</Link>
    </nav>

    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionHeadCopy}>
          <p className={styles.eyebrow}>এলাকা পরিচিতি</p>
          <h2>দুই উপজেলার তথ্য দ্রুত খুঁজে দেখুন</h2>
          <p>ইউনিয়ন, পৌরসভা, স্থানীয় প্রতিষ্ঠান ও সেবাসংক্রান্ত প্রকাশিত তথ্য উপজেলা অনুযায়ী সাজানো।</p>
        </div>
        <Link className={styles.sectionLink} href="/areas">সব এলাকা <span>↗</span></Link>
      </div>

      <div className={styles.bento}>
        <Link className={styles.areaCard} href="/areas?upazila=daudkandi">
          <div className={styles.areaTop}><span className={styles.areaNumber}>01 / DAUDKANDI</span><span className={styles.areaArrow}>↗</span></div>
          <div className={styles.areaContent}>
            <span className={styles.areaLabel}>উপজেলা</span>
            <h3>দাউদকান্দি</h3>
            <p>ইউনিয়ন ও পৌরসভার পরিচিতি, গুরুত্বপূর্ণ প্রতিষ্ঠান, সেবা এবং প্রকাশিত স্থানীয় তথ্য।</p>
            <div className={styles.areaMeta}><span>ইউনিয়ন</span><span>পৌরসভা</span><span>স্থানীয় তথ্য</span></div>
          </div>
        </Link>

        <Link className={styles.featureCard} href="/areas?upazila=meghna">
          <div><span className={styles.areaLabel}>উপজেলা</span><h3>মেঘনা</h3><p>ইউনিয়নভিত্তিক পরিচিতি, স্থানীয় প্রতিষ্ঠান, সেবা ও অন্যান্য প্রকাশিত তথ্য।</p></div>
          <span className={styles.featureIcon}>↗</span>
        </Link>

        <Link className={styles.featureCard} href="/sections/event">
          <div><span className={styles.areaLabel}>সময়ভিত্তিক তথ্য</span><h3>কর্মসূচি</h3><p>প্রকাশিত কর্মসূচির তারিখ, সময় এবং স্থান এক জায়গায় দেখুন।</p></div>
          <span className={styles.featureIcon}>◷</span>
        </Link>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.newsPanel}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionHeadCopy}>
            <p className={styles.eyebrow}>সর্বশেষ আপডেট</p>
            <h2>প্রকাশিত সংবাদ</h2>
            <p>শুধু বাস্তবে প্রকাশিত কনটেন্ট এখানে দেখানো হয়। নতুন কিছু না থাকলে নমুনা বা বানানো সংবাদ দেখানো হবে না।</p>
          </div>
          <Link className={styles.sectionLink} href="/news">সংবাদ বিভাগ <span>→</span></Link>
        </div>
        <PostCards posts={posts.slice(0,3)}/>
      </div>
    </section>

    <section className={`${styles.section} ${styles.trust}`}>
      <div className={styles.trustCopy}>
        <p className={styles.eyebrow}>তথ্য প্রকাশের ধাপ</p>
        <h2>পরিষ্কার প্রক্রিয়া,<br/>সহজ যাচাই</h2>
        <p>তথ্য তৈরির সময় খসড়া, যাচাই এবং প্রকাশ—এই ধাপগুলো আলাদা রাখা হয়েছে যাতে জনসমক্ষে দেখানো তথ্যের অবস্থা বোঝা সহজ হয়।</p>
      </div>

      <div className={styles.trustSteps}>
        <div className={styles.trustStep}><span className={styles.stepNo}>01</span><div><h3>তথ্য সংগ্রহ</h3><p>এলাকা বা প্রকাশনার তথ্য আলাদা রেকর্ডে সংরক্ষণ করা হয়।</p></div></div>
        <div className={styles.trustStep}><span className={styles.stepNo}>02</span><div><h3>যাচাই ও সম্পাদনা</h3><p>প্রকাশের আগে তথ্য সম্পাদনা, উৎস এবং প্রয়োজনীয় যাচাই দেখা যায়।</p></div></div>
        <div className={styles.trustStep}><span className={styles.stepNo}>03</span><div><h3>প্রকাশ</h3><p>অনুমোদিত অবস্থায় থাকা কনটেন্টই মূল ওয়েবসাইটে দৃশ্যমান হয়।</p></div></div>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.finalCard}>
        <div><h2>যে তথ্য দরকার, সেখান থেকেই শুরু করুন</h2><p>এলাকা, সংবাদ, কর্মসূচি ও প্রকাশনা—প্রধান বিভাগগুলো সরাসরি খুলুন।</p></div>
        <div className={styles.finalActions}>
          <Link className={styles.primaryAction} href="/areas">এলাকা দেখুন</Link>
          <Link className={styles.secondaryAction} href="/news">সংবাদ দেখুন</Link>
        </div>
      </div>
    </section>
  </div>;
}
