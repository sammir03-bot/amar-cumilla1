import type {Metadata} from 'next';
import Link from 'next/link';
import {getAreas,getPosts,mediaUrl} from '../lib/content';
import {PostCards} from '../components/posts';
import styles from './home.module.css';
import extra from './home-sections.module.css';

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
function firstImage(paths:string[]){return paths.find(x=>!x.endsWith('.pdf'))??null;}

const activityHighlights=[
  {label:'জনসেবা',title:'মেঘনা উপজেলায় সাঁকো নির্মাণ উদ্যোগ',description:'প্রকাশিত প্রতিবেদনে স্থানীয় চলাচলের সুবিধায় সাঁকো নির্মাণের উদ্যোগের কথা উল্লেখ করা হয়েছে।',href:'/posts/meghna-jamaat-bamboo-bridge-apr-2025',icon:'⌁'},
  {label:'শিক্ষা',title:'জিপিএ-৫ পাওয়া শিক্ষার্থীদের সংবর্ধনা',description:'দাউদকান্দিতে কৃতী শিক্ষার্থীদের নিয়ে আয়োজিত সংবর্ধনার প্রকাশিত তথ্য।',href:'/posts/daudkandi-student-reception-jul-2025',icon:'✦'},
  {label:'স্থানীয় উদ্যোগ',title:'মারুকায় সড়ক সংস্কার কার্যক্রম',description:'মারুকা এলাকায় যুব বিভাগের উদ্যোগে সড়ক সংস্কারের প্রকাশিত কার্যক্রম।',href:'/posts/maruka-jamaat-road-repair-oct-2025',icon:'↗'},
  {label:'সামাজিক সম্প্রীতি',title:'বিভিন্ন পূজামণ্ডপ পরিদর্শন',description:'দাউদকান্দির বিভিন্ন পূজামণ্ডপ পরিদর্শন নিয়ে প্রকাশিত সংবাদ ও স্থানীয় কার্যক্রম।',href:'/posts/daudkandi-jamaat-puja-visit-oct-2025',icon:'◎'},
] as const;

const officialChannels=[
  {label:'অফিসিয়াল ওয়েবসাইট',meta:'বাংলাদেশ জামায়াতে ইসলামী',href:'https://www.jamaat-e-islami.org/',icon:'↗'},
  {label:'Facebook',meta:'bji.official',href:'https://www.facebook.com/bji.official/',icon:'f'},
  {label:'YouTube',meta:'@bjiofficial',href:'https://www.youtube.com/@bjiofficial',icon:'▶'},
  {label:'X / Twitter',meta:'@bji_official',href:'https://x.com/bji_official',icon:'𝕏'},
] as const;

export default async function Home(){
  const [{posts:news,count:newsCount},{posts:leaders,count:leaderCount},areas]=await Promise.all([getPosts('news'),getPosts('leader'),getAreas()]);
  const heroArea=areas.find(a=>a.slug==='municipality')??areas.find(a=>a.image_url)??areas[0];
  const featuredAreas=['municipality','gouripur','manikarchar','govindapur'].map(slug=>areas.find(a=>a.slug===slug)).filter(Boolean);
  const leaderCards=await Promise.all(leaders.slice(0,5).map(async p=>{const path=firstImage(p.media_paths??[]);return {p,image:path?await mediaUrl(path):null};}));
  const websiteJsonLd={'@context':'https://schema.org','@type':'WebSite',name:'আমার কুমিল্লা এক',alternateName:['কুমিল্লা-১','Cumilla-1'],url:siteUrl,inLanguage:'bn-BD',description};

  return <div className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteJsonLd)}}/>
    <section className={styles.hero}>
      {heroArea?.image_url&&<img className={styles.heroImage} src={heroArea.image_url} alt="দাউদকান্দি এলাকার দৃশ্য"/>}<div className={styles.heroShade}/><div className={styles.heroGrid}/>
      <div className={styles.heroCopy}>
        <div className={styles.partyLine}><img src="/logo.svg" alt=""/><span>বাংলাদেশ জামায়াতে ইসলামী · কুমিল্লা-১</span></div>
        <h1>দাউদকান্দি ও মেঘনার<br/><strong>তথ্য, নেতৃত্ব ও কার্যক্রম</strong></h1>
        <p>এলাকার যাচাইকৃত তথ্য, প্রকাশিত সংবাদ, সাংগঠনিক নেতৃত্ব, জনসেবামূলক উদ্যোগ ও গুরুত্বপূর্ণ প্রকাশনা—একটি আধুনিক স্থানীয় তথ্যকেন্দ্রে।</p>
        <div className={styles.heroActions}><Link className={styles.primary} href="/news">সর্বশেষ সংবাদ <span>→</span></Link><Link className={styles.secondary} href="/areas">আমাদের এলাকা</Link></div>
      </div>
      <div className={styles.heroStats}><div><strong>{areas.length.toLocaleString('bn-BD')}</strong><span>এলাকার রেকর্ড</span></div><div><strong>{newsCount.toLocaleString('bn-BD')}</strong><span>প্রকাশিত সংবাদ</span></div><div><strong>{leaderCount.toLocaleString('bn-BD')}</strong><span>নেতৃত্ব পরিচিতি</span></div></div>
      {heroArea?.image_source_url&&<a className={styles.heroCredit} href={heroArea.image_source_url} target="_blank" rel="noopener noreferrer">ছবি: {heroArea.image_credit||'Wikimedia Commons'}{heroArea.image_license?` · ${heroArea.image_license}`:''}</a>}
    </section>

    <nav className={styles.jump} aria-label="প্রধান বিভাগ"><Link href="/about"><span>01</span>আমাদের সম্পর্কে</Link><Link href="/sections/leader"><span>02</span>নেতৃত্ব</Link><Link href="/news"><span>03</span>সর্বশেষ সংবাদ</Link><Link href="/areas"><span>04</span>এলাকা</Link><Link href="/sections/gallery"><span>05</span>গ্যালারি</Link></nav>

    <section className={styles.section}>
      <div className={styles.heading}><div><p className={styles.eyebrow}>নেতৃত্বকে জানুন</p><h2>স্থানীয় সাংগঠনিক নেতৃত্ব</h2><p>প্রকাশিত সংবাদ ও উন্মুক্ত সূত্রে উল্লেখিত দায়িত্বের ভিত্তিতে তৈরি পরিচিতি। দায়িত্ব পরিবর্তিত হলে Admin থেকে হালনাগাদ করা যাবে।</p></div><Link href="/sections/leader">সব নেতৃত্ব →</Link></div>
      <div className={styles.leaderRail}>{leaderCards.map(({p,image},i)=><Link className={styles.leaderCard} href={'/posts/'+p.slug} key={p.id}><div className={styles.leaderPortrait}>{image?<img src={image} alt={p.title}/>:<img className={styles.leaderLogo} src="/logo.svg" alt=""/>}<span>{String(i+1).padStart(2,'0')}</span></div><div className={styles.leaderBody}><small>নেতৃত্ব পরিচিতি</small><h3>{p.title}</h3><p>{p.body.slice(0,105)}{p.body.length>105?'…':''}</p><b>পরিচিতি দেখুন →</b></div></Link>)}</div>
    </section>

    <section className={`${styles.section} ${styles.newsSection}`}><div className={styles.heading}><div><p className={styles.eyebrow}>সর্বশেষ আপডেট</p><h2>খবর ও কার্যক্রম</h2><p>দাউদকান্দি, মেঘনা ও কুমিল্লা-১ সম্পর্কিত যাচাইযোগ্য প্রকাশিত তথ্য।</p></div><Link href="/news">সব সংবাদ →</Link></div><PostCards posts={news.slice(0,6)}/></section>

    <section className={styles.section}>
      <div className={styles.heading}><div><p className={styles.eyebrow}>কার্যক্রমের ক্ষেত্র</p><h2>প্রকাশিত স্থানীয় উদ্যোগ</h2><p>জনসেবা, শিক্ষা, স্থানীয় অবকাঠামো ও সামাজিক সম্প্রীতি—প্রকাশিত সংবাদসূত্রে পাওয়া কিছু কার্যক্রম এক নজরে।</p></div><Link href="/news">আরও কার্যক্রম →</Link></div>
      <div className={extra.activityGrid}>{activityHighlights.map((item,index)=><Link className={extra.activityCard} href={item.href} key={item.href}><div className={extra.activityTop}><span className={extra.activityIcon}>{item.icon}</span><small>{String(index+1).padStart(2,'0')}</small></div><div><p>{item.label}</p><h3>{item.title}</h3><span>{item.description}</span></div><b>বিস্তারিত →</b></Link>)}</div>
    </section>

    <section className={styles.section}>
      <div className={styles.heading}><div><p className={styles.eyebrow}>কুমিল্লা-১</p><h2>এলাকাকে জানুন</h2><p>ইউনিয়ন ও পৌরসভার পরিচিতি, শিক্ষা প্রতিষ্ঠান, স্থানীয় সেবা এবং সরকারি/প্রাথমিক তথ্যসূত্র এক জায়গায়।</p></div><Link href="/areas">সব এলাকা দেখুন →</Link></div>
      <div className={styles.areaGrid}>{featuredAreas.map((area,index)=>area&&<Link className={styles.areaCard} href={`/areas/${area.upazila}/${area.slug}`} key={area.id}>{area.image_url&&<img src={area.image_url} alt={`${area.name} এলাকার দৃশ্য`} loading="lazy"/>}<span className={styles.areaShade}/><div className={styles.areaCopy}><small>{index===0?'দাউদকান্দি':'কুমিল্লা-১ এলাকা'}</small><h3>{area.name}</h3><p>{area.description.slice(0,90)}{area.description.length>90?'…':''}</p><b>এলাকার তথ্য →</b></div></Link>)}</div>
    </section>

    <section className={`${styles.section} ${styles.serviceSection}`}><div className={styles.serviceIntro}><p className={styles.eyebrow}>তথ্য ও জনসেবা</p><h2>যা দরকার,<br/>দ্রুত খুঁজুন</h2><p>শিক্ষা প্রতিষ্ঠান, নাগরিক সেবা, সরকারি উৎস, কর্মসূচি ও প্রকাশনা—সাইটের মূল তথ্যগুলো সরাসরি খুলুন।</p></div><div className={styles.serviceGrid}><Link href="/areas"><span>⌖</span><strong>ইউনিয়ন ও পৌরসভা</strong><small>পরিচিতি, প্রতিষ্ঠান ও স্থানীয় সেবা</small></Link><Link href="/sections/event"><span>◷</span><strong>কর্মসূচি</strong><small>তারিখ, সময় ও স্থানভিত্তিক তথ্য</small></Link><Link href="/sections/document"><span>▤</span><strong>প্রকাশনা</strong><small>নথি ও গুরুত্বপূর্ণ রেফারেন্স</small></Link><Link href="/contact"><span>↗</span><strong>যোগাযোগ</strong><small>অনুমোদিত যোগাযোগের তথ্য</small></Link></div></section>

    <section className={`${styles.section} ${extra.channels}`}>
      <div className={extra.channelIntro}><p className={styles.eyebrow}>সংযুক্ত থাকুন</p><h2>অফিসিয়াল চ্যানেল</h2><p>কেন্দ্রীয় সংগঠনের যাচাইকৃত ওয়েবসাইট ও অফিসিয়াল সামাজিক মাধ্যমের লিংক। স্থানীয় কুমিল্লা-১ তথ্য এই ওয়েবসাইটেই আলাদাভাবে প্রকাশ করা হয়।</p></div>
      <div className={extra.channelGrid}>{officialChannels.map(item=><a href={item.href} target="_blank" rel="noopener noreferrer" key={item.href}><span>{item.icon}</span><div><strong>{item.label}</strong><small>{item.meta}</small></div><b>↗</b></a>)}</div>
    </section>

    <section className={`${styles.section} ${styles.connect}`}><div><p className={styles.eyebrow}>হালনাগাদ তথ্য</p><h2>নতুন কনটেন্ট যোগ হবে নিয়মিত</h2><p>Admin panel থেকে নতুন সংবাদ, নিজস্ব ছবি, নেতৃত্ব, কর্মসূচি ও এলাকার তথ্য সহজে যোগ ও হালনাগাদ করা যাবে।</p></div><div className={styles.connectActions}><Link className={styles.primaryDark} href="/news">খবর দেখুন</Link><Link className={styles.outlineDark} href="/sections/gallery">গ্যালারি</Link></div></section>
  </div>;
}
