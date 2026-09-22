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

const actionLinks=[
  {label:'কর্মসূচি',title:'চলমান ও আসন্ন কর্মসূচির তথ্য দেখুন',href:'/sections/event'},
  {label:'সংবাদ',title:'দাউদকান্দি ও মেঘনার সর্বশেষ প্রকাশিত খবর',href:'/news'},
  {label:'এলাকা',title:'ইউনিয়ন ও পৌরসভাভিত্তিক তথ্যভান্ডার',href:'/areas'},
] as const;

export default async function Home(){
  const [{posts:news,count:newsCount},{posts:leaders,count:leaderCount},areas]=await Promise.all([
    getPosts('news'),
    getPosts('leader'),
    getAreas(),
  ]);

  const newsWithImages=await Promise.all(news.slice(0,6).map(async post=>({post,image:await postImage(post)})));
  const heroNews=newsWithImages.slice(0,4);
  const latest=newsWithImages.slice(0,3);
  const actionFeature=newsWithImages.find(item=>item.image)??newsWithImages[0]??null;
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

    <section className={styles.photoWall} aria-label="কুমিল্লা-১ মাঠের কার্যক্রম">
      <div className={`${styles.photoTile} ${styles.photoLead}`}><img src="/home-hero.svg" alt="দাউদকান্দিতে স্থানীয় কার্যক্রম"/></div>
      {heroNews.slice(0,3).map(({post,image},index)=><Link className={`${styles.photoTile} ${styles['photo'+(index+2)]}`} href={`/posts/${post.slug}`} key={post.id}>
        {image?<img src={image} alt=""/>:<span className={styles.photoFallback}>কুমিল্লা–১</span>}
        <i/>
      </Link>)}
    </section>

    <section className={styles.identity}>
      <div className={styles.identityMark}>আমরা</div>
      <div className={styles.identityBody}>
        <h1>কুমিল্লা–১</h1>
        <p>দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ, স্থানীয় নেতৃত্ব, জনসেবামূলক উদ্যোগ, ইউনিয়নভিত্তিক তথ্য এবং গুরুত্বপূর্ণ নথি—এক জায়গায়।</p>
        <div className={styles.identityActions}>
          <Link href="/news">সর্বশেষ সংবাদ</Link>
          <Link href="/areas">এলাকা পরিচিতি</Link>
        </div>
      </div>
    </section>

    <section className={styles.actionSection}>
      <div className={styles.actionHeader}>
        <div><span>স্থানীয়ভাবে যুক্ত থাকুন</span><h2>কার্যক্রম দেখুন</h2></div>
        <p>প্রকাশিত কর্মসূচি, জনসেবা, শিক্ষা, সামাজিক উদ্যোগ ও সাংগঠনিক আপডেট থেকে প্রয়োজনীয় অংশ দ্রুত খুলুন।</p>
      </div>

      <div className={styles.actionLayout}>
        {actionFeature&&<Link className={styles.actionFeature} href={`/posts/${actionFeature.post.slug}`}>
          {actionFeature.image&&<img src={actionFeature.image} alt=""/>}
          <div className={styles.actionFeatureShade}/>
          <div className={styles.actionFeatureCopy}>
            <span>সাম্প্রতিক কার্যক্রম</span>
            <h3>{actionFeature.post.title}</h3>
            <b>বিস্তারিত দেখুন ↗</b>
          </div>
        </Link>}
        <div className={styles.actionCards}>
          {actionLinks.map(item=><Link href={item.href} className={styles.actionCard} key={item.href}>
            <span>{item.label}</span><h3>{item.title}</h3><b>→</b>
          </Link>)}
        </div>
      </div>
    </section>

    <section className={styles.latestSection}>
      <div className={styles.sectionTitle}>
        <div><span>সর্বশেষ</span><h2>সংবাদ ও আপডেট</h2></div>
        <Link href="/news">সব সংবাদ দেখুন →</Link>
      </div>
      <div className={styles.latestGrid}>
        {latest.map(({post,image})=><Link className={styles.latestCard} href={`/posts/${post.slug}`} key={post.id}>
          <div className={styles.latestImage}>{image?<img src={image} alt=""/>:<span>কুমিল্লা–১</span>}</div>
          <div className={styles.latestCopy}>
            <small>{post.published_at?bnDate(post.published_at):'সংবাদ'}</small>
            <h3>{post.title}</h3>
            <p>{post.body.slice(0,130)}{post.body.length>130?'…':''}</p>
            <b>পড়ুন →</b>
          </div>
        </Link>)}
      </div>
    </section>

    <section className={styles.statsBand}>
      <div><strong>{newsCount.toLocaleString('bn-BD')}</strong><span>প্রকাশিত সংবাদ</span></div>
      <div><strong>{leaderCount.toLocaleString('bn-BD')}</strong><span>নেতৃত্ব পরিচিতি</span></div>
      <div><strong>{areas.length.toLocaleString('bn-BD')}</strong><span>এলাকার রেকর্ড</span></div>
      <Link href="/sections/gallery">গ্যালারি <b>↗</b></Link>
    </section>

    <section className={styles.peopleSection}>
      <div className={styles.peopleIntro}>
        <span>নেতৃত্ব</span>
        <h2>স্থানীয় দায়িত্বশীলদের পরিচিতি</h2>
        <p>প্রকাশিত সংবাদ ও উন্মুক্ত সূত্রে উল্লেখিত দায়িত্বের ভিত্তিতে পরিচিতি সাজানো হয়েছে। ভুল বা অমিল ছবি দেখানো হয় না।</p>
        <Link href="/sections/leader">সব নেতৃত্ব দেখুন →</Link>
      </div>
      <div className={styles.peopleList}>
        {leaders.slice(0,6).map((leader,index)=><Link href={`/posts/${leader.slug}`} className={styles.personRow} key={leader.id}>
          <span>{String(index+1).padStart(2,'0')}</span>
          <div><h3>{leader.title}</h3><p>{leader.body.slice(0,100)}{leader.body.length>100?'…':''}</p></div>
          <b>↗</b>
        </Link>)}
      </div>
    </section>

    <section className={styles.areaSection}>
      <div className={styles.sectionTitle}>
        <div><span>দাউদকান্দি — মেঘনা</span><h2>এলাকাকে জানুন</h2></div>
        <Link href="/areas">সব এলাকা →</Link>
      </div>
      <div className={styles.areaGrid}>
        {featuredAreas.map(area=>area&&<Link className={styles.areaCard} href={`/areas/${area.upazila}/${area.slug}`} key={area.id}>
          {area.image_url&&<img src={area.image_url} alt={`${area.name} এলাকার দৃশ্য`}/>}<i/>
          <div><small>{area.upazila}</small><h3>{area.name}</h3><b>তথ্য দেখুন →</b></div>
        </Link>)}
      </div>
    </section>

    <section className={styles.joinSection}>
      <div><span>আপডেট থাকুন</span><h2>খবর, কার্যক্রম ও এলাকার তথ্য একসাথে</h2><p>নতুন তথ্য Admin panel থেকে নিয়মিত যোগ ও সংশোধন করা যাবে।</p></div>
      <div><Link href="/news">সংবাদ দেখুন</Link><Link href="/contact">যোগাযোগ</Link></div>
    </section>
  </div>;
}
