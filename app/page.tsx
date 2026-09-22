import type {Metadata} from 'next';
import Link from 'next/link';
import {bnDate,getAreas,getPosts,mediaUrl,type Post} from '../lib/content';
import styles from './home-modern.module.css';

const siteUrl='https://amar-cumilla1.vercel.app';
const title='আমার কুমিল্লা এক | কুমিল্লা-১, দাউদকান্দি ও মেঘনা';
const description='বাংলাদেশ জামায়াতে ইসলামী কুমিল্লা-১ এলাকার দাউদকান্দি ও মেঘনা উপজেলার এলাকা পরিচিতি, স্থানীয় সংবাদ, নেতৃত্ব, কর্মসূচি, প্রকাশনা ও সাংগঠনিক তথ্য।';

export const metadata:Metadata={
  title,description,
  alternates:{canonical:siteUrl},
  openGraph:{type:'website',locale:'bn_BD',url:siteUrl,siteName:'আমার কুমিল্লা এক',title,description,images:[{url:`${siteUrl}/home-hero-image`,width:1600,height:900,alt:'কুমিল্লা-১ এলাকার জনজীবন ও স্থানীয় কার্যক্রম'}]},
  twitter:{card:'summary_large_image',title,description,images:[`${siteUrl}/home-hero-image`]},
};

export const dynamic='force-dynamic';

async function postImage(post:Post){
  const attached=(post.media_paths??[]).find(path=>!path.endsWith('.pdf'));
  const raw=attached??post.cover_url;
  return raw?await mediaUrl(raw):null;
}

const quickLinks=[
  ['কর্মসূচি','প্রকাশিত কর্মসূচি ও স্থানীয় কার্যক্রম','/sections/event'],
  ['সংবাদ','দাউদকান্দি ও মেঘনার সর্বশেষ আপডেট','/news'],
  ['এলাকা','ইউনিয়ন ও পৌরসভাভিত্তিক তথ্য','/areas'],
] as const;

export default async function Home(){
  const [{posts:news,count:newsCount},{posts:leaders,count:leaderCount},areas]=await Promise.all([
    getPosts('news'),getPosts('leader'),getAreas(),
  ]);

  const items=await Promise.all(news.slice(0,6).map(async post=>({post,image:await postImage(post)})));
  const latest=items.slice(0,3);
  const imageItems=items.filter(item=>item.image);
  const collageB=imageItems[1]?.image??'/home-hero-image';
  const collageC=imageItems[2]?.image??'/home-hero-image';
  const featuredAreas=['municipality','gouripur','manikarchar','govindapur'].map(slug=>areas.find(area=>area.slug===slug)).filter(Boolean);

  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroEyebrow}>আমার</div>
      <h1>কুমিল্লা–১</h1>
      <p className={styles.heroSub}>দাউদকান্দি ও মেঘনা</p>

      <div className={styles.heroCollage} aria-label="কুমিল্লা-১ এলাকার মানুষের সঙ্গে স্থানীয় কার্যক্রম">
        <figure className={`${styles.heroPhoto} ${styles.heroPhotoMain}`}><img src="/home-hero-image" alt="কুমিল্লা-১ এলাকার মানুষের সঙ্গে স্থানীয় কার্যক্রম" fetchPriority="high"/></figure>
        <figure className={`${styles.heroPhoto} ${styles.heroPhotoSmall}`}><img src="/bridge-sunset.webp" alt="দাউদকান্দির নদী ও সেতুর সূর্যাস্তের দৃশ্য"/></figure>
      </div>
    </section>

    <section className={styles.statement}>
      <p>দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ, স্থানীয় নেতৃত্ব, জনসেবামূলক উদ্যোগ, ইউনিয়নভিত্তিক তথ্য এবং গুরুত্বপূর্ণ নথি—সবকিছু এক জায়গায় সহজভাবে তুলে ধরা হচ্ছে।</p>
      <div className={styles.statementGallery}>
        <figure className={styles.floatOne}><img src={collageB} alt=""/></figure>
        <figure className={styles.floatTwo}><img src={collageC} alt=""/></figure>
        <figure className={styles.floatThree}><img src="/bridge-sunset.webp" alt="দাউদকান্দির নদী ও সেতুর সূর্যাস্তের দৃশ্য"/></figure>
      </div>
    </section>

    <section className={styles.quickSection}>
      <span className={styles.sectionKicker}>কুমিল্লা–১</span>
      <div className={styles.sectionTop}><h2>এখন যা জানতে চান</h2><p>সংবাদ, কর্মসূচি ও এলাকাভিত্তিক তথ্য দ্রুত খুলুন।</p></div>
      <div className={styles.quickGrid}>{quickLinks.map(([label,text,href],index)=><Link href={href} className={styles.quickCard} key={href}><span>0{index+1}</span><small>{label}</small><h3>{text}</h3><b>↗</b></Link>)}</div>
    </section>

    <section className={styles.latestSection}>
      <div className={styles.sectionTop}><div><span className={styles.sectionKicker}>সর্বশেষ আপডেট</span><h2>সংবাদ ও কার্যক্রম</h2></div><Link href="/news">সব সংবাদ →</Link></div>
      <div className={styles.latestGrid}>{latest.map(({post,image})=><Link href={`/posts/${post.slug}`} className={styles.latestCard} key={post.id}>
        <div className={styles.latestImage}>{image?<img src={image} alt=""/>:<span>কুমিল্লা–১</span>}</div>
        <div className={styles.latestCopy}><small>{post.published_at?bnDate(post.published_at):'সংবাদ'}</small><h3>{post.title}</h3><p>{post.body.slice(0,120)}{post.body.length>120?'…':''}</p><b>পড়ুন →</b></div>
      </Link>)}</div>
    </section>

    <section className={styles.statsBand}>
      <div><strong>{newsCount.toLocaleString('bn-BD')}</strong><span>প্রকাশিত সংবাদ</span></div>
      <div><strong>{leaderCount.toLocaleString('bn-BD')}</strong><span>নেতৃত্ব পরিচিতি</span></div>
      <div><strong>{areas.length.toLocaleString('bn-BD')}</strong><span>এলাকার রেকর্ড</span></div>
      <Link href="/sections/gallery">গ্যালারি <b>↗</b></Link>
    </section>

    <section className={styles.peopleSection}>
      <div className={styles.peopleIntro}><span className={styles.sectionKicker}>নেতৃত্ব</span><h2>স্থানীয় দায়িত্বশীলদের পরিচিতি</h2><p>প্রকাশিত সংবাদ ও উন্মুক্ত সূত্রে পাওয়া তথ্যের ভিত্তিতে পরিচিতি সাজানো হয়েছে।</p><Link href="/sections/leader">সব নেতৃত্ব →</Link></div>
      <div className={styles.peopleList}>{leaders.slice(0,6).map((leader,index)=><Link href={`/posts/${leader.slug}`} className={styles.personRow} key={leader.id}><span>{String(index+1).padStart(2,'0')}</span><div><h3>{leader.title}</h3><p>{leader.body.slice(0,92)}{leader.body.length>92?'…':''}</p></div><b>↗</b></Link>)}</div>
    </section>

    <section className={styles.areaSection}>
      <div className={styles.sectionTop}><div><span className={styles.sectionKicker}>দাউদকান্দি — মেঘনা</span><h2>এলাকাকে জানুন</h2></div><Link href="/areas">সব এলাকা →</Link></div>
      <div className={styles.areaGrid}>{featuredAreas.map(area=>area&&<Link className={styles.areaCard} href={`/areas/${area.upazila}/${area.slug}`} key={area.id}>{area.image_url&&<img src={area.image_url} alt={`${area.name} এলাকার দৃশ্য`}/>}<i/><div><small>{area.upazila}</small><h3>{area.name}</h3><b>তথ্য দেখুন →</b></div></Link>)}</div>
    </section>
  </div>;
}
