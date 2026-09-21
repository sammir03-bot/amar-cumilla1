import Link from 'next/link';
import {getPosts} from '../lib/content';
import {PostCards} from '../components/posts';

export const dynamic = 'force-dynamic';

const shortcuts = [
  {href: '/areas', label: 'এলাকা পরিচিতি', meta: 'ইউনিয়ন ও পৌরসভা', icon: '⌁'},
  {href: '/news', label: 'সর্বশেষ সংবাদ', meta: 'প্রকাশিত ও যাচাইকৃত', icon: '↗'},
  {href: '/sections/event', label: 'কর্মসূচি', meta: 'তারিখ, সময় ও স্থান', icon: '◷'},
  {href: '/sections/leader', label: 'নেতৃত্ব', meta: 'প্রকাশিত পরিচিতি', icon: '◎'},
];

export default async function Home() {
  const {posts} = await getPosts('news');

  return <>
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

      <div className="hero-copy">
        <div className="hero-kicker"><span /> কুমিল্লা–১ · দাউদকান্দি — মেঘনা</div>
        <h1 id="home-title">এলাকার তথ্য,<br/><em>মানুষের কাছে সহজভাবে।</em></h1>
        <p className="hero-lead">স্থানীয় পরিচিতি, যাচাইকৃত সংবাদ, কর্মসূচি ও প্রকাশিত সাংগঠনিক তথ্য—একটি পরিষ্কার, দ্রুত ও মোবাইলবান্ধব প্ল্যাটফর্মে।</p>
        <div className="hero-actions">
          <Link className="button button-light" href="/areas">আপনার এলাকা দেখুন <span>↗</span></Link>
          <Link className="text-link" href="/news">সর্বশেষ সংবাদ <span>→</span></Link>
        </div>
        <div className="hero-proof">
          <div><span className="proof-dot" /> যাচাই ছাড়া তথ্য প্রকাশ নয়</div>
          <div>সম্পাদকের অনুমোদনের পরেই কনটেন্ট দৃশ্যমান</div>
        </div>
      </div>

      <aside className="hero-dashboard" aria-label="দ্রুত প্রবেশ">
        <div className="dashboard-topline">
          <span>দ্রুত প্রবেশ</span>
          <span className="live-pill"><i /> তথ্যকেন্দ্র</span>
        </div>
        <div className="dashboard-metrics">
          <div className="metric-card"><strong>০২</strong><span>উপজেলা</span></div>
          <div className="metric-card"><strong>২৪</strong><span>প্রস্তুত এলাকা রেকর্ড</span></div>
        </div>
        <div className="shortcut-list">
          {shortcuts.map((item, index) => <Link href={item.href} className="shortcut-row" key={item.href}>
            <span className="shortcut-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="shortcut-copy"><strong>{item.label}</strong><small>{item.meta}</small></span>
            <span className="shortcut-icon" aria-hidden="true">{item.icon}</span>
          </Link>)}
        </div>
      </aside>
    </section>

    <section className="home-ribbon" aria-label="ওয়েবসাইটের প্রধান বিভাগ">
      <span>দাউদকান্দি</span><i />
      <span>মেঘনা</span><i />
      <span>সংবাদ</span><i />
      <span>কর্মসূচি</span><i />
      <span>প্রকাশনা</span>
    </section>

    <section className="home-section">
      <div className="section-heading premium-heading">
        <div>
          <p className="eyebrow">এলাকা পরিচিতি</p>
          <h2>দুই উপজেলা, এক তথ্যকেন্দ্র</h2>
          <p>প্রকাশিত ও যাচাইকৃত এলাকার তথ্য দ্রুত খুঁজে দেখুন। প্রতিটি এলাকার জন্য আলাদা পরিচিতি পৃষ্ঠা রাখা হয়েছে।</p>
        </div>
        <Link className="section-link" href="/areas">সব এলাকা <span>↗</span></Link>
      </div>

      <div className="area-showcase">
        <Link className="area-premium-card" href="/areas?upazila=daudkandi">
          <div className="area-number">01</div>
          <div className="area-card-content"><span className="eyebrow">উপজেলা</span><h3>দাউদকান্দি</h3><p>ইউনিয়ন ও পৌরসভার প্রকাশিত পরিচিতি, প্রতিষ্ঠান, সেবা ও স্থানীয় তথ্য।</p></div>
          <div className="area-arrow" aria-hidden="true">↗</div>
        </Link>
        <Link className="area-premium-card" href="/areas?upazila=meghna">
          <div className="area-number">02</div>
          <div className="area-card-content"><span className="eyebrow">উপজেলা</span><h3>মেঘনা</h3><p>ইউনিয়নভিত্তিক প্রকাশিত পরিচিতি, প্রতিষ্ঠান, সেবা ও স্থানীয় তথ্য।</p></div>
          <div className="area-arrow" aria-hidden="true">↗</div>
        </Link>
      </div>
    </section>

    <section className="home-section news-zone">
      <div className="section-heading premium-heading">
        <div>
          <p className="eyebrow">সংবাদ ও কার্যক্রম</p>
          <h2>সর্বশেষ প্রকাশিত সংবাদ</h2>
          <p>শুধু প্রকাশিত কনটেন্ট এখানে দেখানো হয়। নতুন কিছু প্রকাশ না হলে বানানো বা নমুনা সংবাদ দেখানো হবে না।</p>
        </div>
        <Link className="section-link" href="/news">সংবাদ বিভাগ <span>→</span></Link>
      </div>
      <PostCards posts={posts.slice(0, 3)} />
    </section>

    <section className="home-section trust-zone">
      <div className="trust-intro">
        <p className="eyebrow">তথ্যের মান</p>
        <h2>বিশ্বাসযোগ্যতার জন্য<br/>তিনটি স্পষ্ট নিয়ম</h2>
        <p>প্রস্তুতিমূলক অবস্থায়ও তথ্য প্রকাশের আগে উৎস, সম্পাদনা ও প্রকাশ-অবস্থা আলাদাভাবে নিয়ন্ত্রিত রাখা হয়েছে।</p>
      </div>
      <div className="trust-list">
        <div className="trust-item"><span>01</span><div><h3>উৎস</h3><p>এলাকার রেকর্ডে উৎস ও যাচাইয়ের অবস্থা সংরক্ষণ করা যায়।</p></div></div>
        <div className="trust-item"><span>02</span><div><h3>সম্পাদনা</h3><p>ড্রাফট ও প্রকাশিত কনটেন্ট আলাদা রাখা হয়; অনুমোদন ছাড়া জনসমক্ষে আসে না।</p></div></div>
        <div className="trust-item"><span>03</span><div><h3>স্বচ্ছতা</h3><p>এটি সরকারি সেবার ওয়েবসাইট নয়—পরিচয় ও প্রস্তুতিমূলক অবস্থা স্পষ্টভাবে দেখানো হয়।</p></div></div>
      </div>
    </section>
  </>;
}
