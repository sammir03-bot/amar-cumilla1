import type {Metadata} from 'next';
import Link from 'next/link';
import {bnDate,getAreas,getPosts,mediaUrl,type Post} from '../lib/content';
import styles from './home-modern.module.css';

const siteUrl='https://amar-cumilla1.vercel.app';
const title='আমার কুমিল্লা এক | কুমিল্লা-১, দাউদকান্দি ও মেঘনা';
const description='বাংলাদেশ জামায়াতে ইসলামী কুমিল্লা-১ এলাকার দাউদকান্দি ও মেঘনা উপজেলার এলাকা পরিচিতি, স্থানীয় সংবাদ, নেতৃত্ব, কর্মসূচি, প্রকাশনা ও সাংগঠনিক তথ্য।';

export const metadata:Metadata={
  title,description,
  keywords:['কুমিল্লা-১','কুমিল্লা ১','দাউদকান্দি','মেঘনা','কুমিল্লা-১ সংবাদ','দাউদকান্দি সংবাদ','মেঘনা সংবাদ','বাংলাদেশ জামায়াতে ইসলামী কুমিল্লা-১','জামায়াত কুমিল্লা ১','Cumilla-1','Daudkandi','Meghna Upazila'],
  alternates:{canonical:siteUrl},
  openGraph:{type:'website',locale:'bn_BD',url:siteUrl,siteName:'আমার কুমিল্লা এক',title,description,images:[{url:`${siteUrl}/logo.svg`,width:256,height:256,alt:'আমার কুমিল্লা এক'}]},
  twitter:{card:'summary',title,description,images:[`${siteUrl}/logo.svg`]},
};

export const dynamic='force-dynamic';

async function postImage(post:Post){
  const attached=(post.media_paths??[]).find(path=>!path.endsWith('.pdf'));
  const raw=attached??post.cover_url;
  return raw?await mediaUrl(raw):null;
}

const actionHighlights=[
  {icon:'01',label:'জনসেবা',title:'মেঘনা উপজেলায় সাঁকো নির্মাণ উদ্যোগ',href:'/posts/meghna-jamaat-bamboo-bridge-apr-2025'},
  {icon:'02',label:'শিক্ষা',title:'দাউদকান্দিতে কৃতী শিক্ষার্থীদের সংবর্ধনা',href:'/posts/daudkandi-student-reception-jul-2025'},
  {icon:'03',label:'স্থানীয় উদ্যোগ',title:'মারুকায় যুব বিভাগের সড়ক সংস্কার কার্যক্রম',href:'/posts/maruka-jamaat-road-repair-oct-2025'},
  {icon:'04',label:'সামাজিক সম্প্রীতি',title:'দাউদকান্দির বিভিন্ন পূজামণ্ডপ পরিদর্শন',href:'/posts/daudkandi-jamaat-puja-visit-oct-2025'},
] as const;

export default async function Home(){
  const [{posts:news,count:newsCount},{posts:leaders,count:leaderCount},areas]=await Promise.all([
    getPosts('news'),
    getPosts('leader'),
    getAreas(),
  ]);

  const newsForHome=news.slice(0,5);
  const newsWithImages=await Promise.all(newsForHome.map(async post=>({post,image:await postImage(post)})));
  const featured=newsWithImages[0]??null;
  const compact=newsWithImages.slice(1,5);
  const featuredAreas=['municipality','gouripur','manikarchar','govindapur']
    .map(slug=>areas.find(area=>area.slug===slug))
    .filter(Boolean);

  const websiteJsonLd={
    '@context':'https://schema.org',
    '@type':'WebSite',
    name:'আমার কুমিল্লা এক',
    alternateName:['কুমিল্লা-১','Cumilla-1'],
    url:siteUrl,
    inLanguage:'bn-BD',
    description,
  };

  return <div className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteJsonLd)}}/>

    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <div className={styles.kicker}><i/>বাংলাদেশ জামায়াতে ইসলামী · কুমিল্লা-১</div>
        <h1>দাউদকান্দি ও মেঘনার <span>খবর, মানুষ ও কার্যক্রম</span></h1>
        <p className={styles.heroLead}>প্রকাশিত সংবাদ, স্থানীয় নেতৃত্ব, জনসেবামূলক উদ্যোগ, ইউনিয়নভিত্তিক তথ্য ও গুরুত্বপূর্ণ নথি—একটি পরিচ্ছন্ন ও আধুনিক স্থানীয় তথ্যকেন্দ্রে।</p>
        <div className={styles.heroActions}>
          <Link className={styles.primary} href="/news">সর্বশেষ সংবাদ <span>→</span></Link>
          <Link className={styles.secondary} href="/areas">এলাকা দেখুন</Link>
        </div>
      </div>
      <div className={styles.heroMedia}>
        <img src="/home-hero.svg" alt="দাউদকান্দিতে স্থানীয় কার্যক্রমের দৃশ্য"/>
        <div className={styles.photoNote}>
          <div><small>কুমিল্লা-১ · মাঠের কার্যক্রম</small><strong>স্থানীয় মানুষের সঙ্গে সরাসরি যোগাযোগ</strong></div>
          <Link href="/news" aria-label="সংবাদ দেখুন">↗</Link>
        </div>
      </div>
    </section>

    <div className={styles.pulse}>
      <div className={styles.pulseStat}><strong>{newsCount.toLocaleString('bn-BD')}</strong><span>প্রকাশিত<br/>সংবাদ</span></div>
      <div className={styles.pulseStat}><strong>{leaderCount.toLocaleString('bn-BD')}</strong><span>নেতৃত্ব<br/>পরিচিতি</span></div>
      <div className={styles.pulseStat}><strong>{areas.length.toLocaleString('bn-BD')}</strong><span>ইউনিয়ন ও<br/>পৌরসভা রেকর্ড</span></div>
      <Link className={styles.pulseLink} href="/sections/gallery">গ্যালারি দেখুন <span>→</span></Link>
    </div>

    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div><small>সর্বশেষ আপডেট</small><h2>এখন যা ঘটছে</h2><p>দাউদকান্দি, মেঘনা ও কুমিল্লা-১ সম্পর্কিত সাম্প্রতিক প্রকাশিত সংবাদ ও কার্যক্রম।</p></div>
        <Link href="/news">সব সংবাদ →</Link>
      </div>

      {featured&&<div className={styles.newsLayout}>
        <Link className={styles.featureNews} href={`/posts/${featured.post.slug}`}>
          {featured.image&&<img src={featured.image} alt=""/>}
          <div className={styles.featureContent}>
            <small>{featured.post.published_at?bnDate(featured.post.published_at):'সর্বশেষ সংবাদ'}</small>
            <h3>{featured.post.title}</h3>
            <p>{featured.post.body.slice(0,170)}{featured.post.body.length>170?'…':''}</p>
            <b>বিস্তারিত পড়ুন →</b>
          </div>
        </Link>
        <div className={styles.newsList}>
          {compact.map(({post,image})=><Link className={styles.newsCard} href={`/posts/${post.slug}`} key={post.id}>
            <div className={styles.newsThumb}>{image&&<img src={image} alt="" loading="lazy"/>}</div>
            <div className={styles.newsBody}>
              <small>{post.published_at?bnDate(post.published_at):'সংবাদ'}</small>
              <h3>{post.title}</h3>
              <span>পড়ুন →</span>
            </div>
          </Link>)}
        </div>
      </div>}
    </section>

    <section className={styles.actionBand}>
      <div className={styles.actionTop}>
        <div><small>স্থানীয় কার্যক্রম</small><h2>মানুষের পাশে,<br/>এলাকার ভেতরে</h2></div>
        <p>জনসেবা, শিক্ষা, অবকাঠামো ও সামাজিক সম্প্রীতি—প্রকাশিত সূত্রে পাওয়া স্থানীয় উদ্যোগগুলো আলাদাভাবে সাজানো হয়েছে।</p>
      </div>
      <div className={styles.actionGrid}>
        {actionHighlights.map(item=><Link className={styles.actionCard} href={item.href} key={item.href}>
          <span>{item.icon}</span><small>{item.label}</small><h3>{item.title}</h3><b>বিস্তারিত →</b>
        </Link>)}
      </div>
    </section>

    <section className={`${styles.section} ${styles.leaders}`}>
      <div className={styles.leadersIntro}>
        <small>নেতৃত্ব পরিচিতি</small>
        <h2>যাদের দায়িত্বে স্থানীয় সংগঠন</h2>
        <p>প্রকাশিত সংবাদ ও উন্মুক্ত সূত্রে উল্লেখিত দায়িত্বের ভিত্তিতে তৈরি পরিচিতি। যেসব ব্যক্তির নির্ভরযোগ্য আলাদা ছবি নেই, সেখানে ভুল ছবি ব্যবহার করা হচ্ছে না।</p>
        <Link href="/sections/leader">সব নেতৃত্ব দেখুন →</Link>
      </div>
      <div className={styles.leaderList}>
        {leaders.slice(0,5).map((leader,index)=><Link className={styles.leaderRow} href={`/posts/${leader.slug}`} key={leader.id}>
          <span className={styles.leaderIndex}>{String(index+1).padStart(2,'0')}</span>
          <div><h3>{leader.title}</h3><p>{leader.body.slice(0,115)}{leader.body.length>115?'…':''}</p></div>
          <b>↗</b>
        </Link>)}
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div><small>কুমিল্লা-১</small><h2>এলাকাকে কাছ থেকে জানুন</h2><p>ইউনিয়ন ও পৌরসভাভিত্তিক পরিচিতি, শিক্ষা প্রতিষ্ঠান, গুরুত্বপূর্ণ স্থান, জনসেবা ও স্থানীয় আপডেট।</p></div>
        <Link href="/areas">সব এলাকা →</Link>
      </div>
      <div className={styles.areaStrip}>
        {featuredAreas.map(area=>area&&<Link className={styles.areaCard} href={`/areas/${area.upazila}/${area.slug}`} key={area.id}>
          {area.image_url&&<img src={area.image_url} alt={`${area.name} এলাকার দৃশ্য`} loading="lazy"/>}
          <div className={styles.areaText}><small>{area.kind==='municipality'?'পৌরসভা':'ইউনিয়ন'}</small><h3>{area.name}</h3><p>{area.description.slice(0,88)}{area.description.length>88?'…':''}</p><b>এলাকার তথ্য →</b></div>
        </Link>)}
      </div>
    </section>

    <section className={styles.finalCta}>
      <div><small>তথ্য নিয়মিত হালনাগাদ হচ্ছে</small><h2>এক জায়গায় সংবাদ, নেতৃত্ব ও এলাকার তথ্য</h2><p>নতুন প্রকাশিত তথ্য দেখতে সংবাদ বিভাগ বা ইউনিয়নভিত্তিক পেজ খুলুন।</p></div>
      <div className={styles.finalActions}><Link href="/news">সংবাদ দেখুন</Link><Link href="/areas">এলাকা দেখুন</Link></div>
    </section>
  </div>;
}
