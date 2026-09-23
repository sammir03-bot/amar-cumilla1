import type {Metadata} from 'next';
import Link from 'next/link';
import {bnDate,getAreas,getPosts,mediaUrl,type Post} from '../lib/content';
import styles from './home-modern.module.css';

const siteUrl='https://amar-cumilla1.vercel.app';
const title='Amar Cumilla–1 | Daudkandi & Meghna';
const description='দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ, স্থানীয় নেতৃত্ব, কর্মসূচি, এলাকা পরিচিতি ও গুরুত্বপূর্ণ তথ্য।';

export const metadata:Metadata={
  title,description,
  alternates:{canonical:siteUrl},
  openGraph:{type:'website',locale:'bn_BD',url:siteUrl,siteName:'Amar Cumilla–1',title,description,images:[{url:`${siteUrl}/home-hero-image`,width:1600,height:900,alt:'কুমিল্লা-১ এলাকার জনজীবন ও স্থানীয় কার্যক্রম'}]},
  twitter:{card:'summary_large_image',title,description,images:[`${siteUrl}/home-hero-image`]},
};

export const dynamic='force-dynamic';

async function postImage(post:Post){
  const attached=(post.media_paths??[]).find(path=>!path.endsWith('.pdf'));
  const raw=attached??post.cover_url;
  return raw?await mediaUrl(raw):null;
}

const featureLinks=[
  ['▤','LATEST NEWS','/news'],
  ['●●●','COMMUNITY ACTIVITIES','/sections/event'],
  ['◆','AREA UPDATES','/areas'],
  ['●●','LOCAL LEADERSHIP','/sections/leader'],
] as const;

export default async function Home(){
  const [{posts:news},{posts:leaders},areas]=await Promise.all([
    getPosts('news'),getPosts('leader'),getAreas(),
  ]);
  const items=await Promise.all(news.slice(0,6).map(async post=>({post,image:await postImage(post)})));
  const latest=items.slice(0,3);
  const featuredAreas=['municipality','gouripur','manikarchar','govindapur'].map(slug=>areas.find(area=>area.slug===slug)).filter(Boolean);

  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroGlow}/>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <span>AMAR</span>
          <h1>CUMILLA–1</h1>
          <strong>DAUDKANDI &amp; MEGHNA</strong>
        </div>

        <div className={styles.heroNote}>
          <span>LOCAL INFORMATION</span>
          <b>People · Community · Area</b>
        </div>

        <div className={styles.heroCollage} aria-label="কুমিল্লা-১ এলাকার স্থানীয় কার্যক্রম">
          <figure className={`${styles.heroPhoto} ${styles.heroPhotoMain}`}><img src="/home-hero-image" alt="কুমিল্লা-১ এলাকার মানুষের সঙ্গে স্থানীয় কার্যক্রম" fetchPriority="high"/></figure>
          <figure className={`${styles.heroPhoto} ${styles.heroPhotoSmall}`}><img src="/march-image" alt="দাউদকান্দিতে স্থানীয় জনসমাগম ও কার্যক্রমের দৃশ্য"/></figure>
        </div>

        <p className={styles.heroIntro}>Verified local news, community leadership, community initiatives, and area updates in one place.</p>

        <div className={styles.featureStrip}>{featureLinks.map(([icon,label,href])=><Link href={href} key={href}><i>{icon}</i><span>{label}</span></Link>)}</div>
      </div>
    </section>

    <section className={styles.leadershipShowcase}>
      <div className={styles.leadershipCopy}>
        <span className={styles.goldRule}/>
        <small>LOCAL LEADERSHIP</small>
        <h2>স্থানীয় দায়িত্বশীলদের পরিচিতি</h2>
        <p>প্রকাশিত তথ্যের ভিত্তিতে দাউদকান্দি ও মেঘনার স্থানীয় দায়িত্বশীল ও সাংগঠনিক কার্যক্রমের পরিচিতি।</p>
        <Link href="/sections/leader">পরিচিতি দেখুন <b>→</b></Link>
      </div>
      <div className={styles.leadershipImage}><img src="/leaders-image" alt="স্থানীয় দায়িত্বশীলদের দলীয় ছবি"/></div>
    </section>

    <section className={styles.motto}><span/> <p>“দাউদকান্দি ও মেঘনার তথ্য এক জায়গায়”</p> <span/></section>

    <section className={styles.candidateSection} aria-labelledby="candidate-title">
      <div className={styles.candidateHead}>
        <div>
          <span className={styles.candidateKicker}>ইউনিয়ন নির্বাচন</span>
          <h2 id="candidate-title">প্রার্থী পরিচিতি</h2>
          <p>আনুষ্ঠানিকভাবে অনুমোদিত প্রার্থী নির্ধারিত হলে ছবি, ইউনিয়ন ও সংক্ষিপ্ত পরিচিতি এখানে পাশাপাশি দেখানো হবে।</p>
        </div>
        <span className={styles.candidateStatus}>ঘোষণার অপেক্ষায়</span>
      </div>
      <div className={styles.candidateRail} aria-label="প্রার্থী পরিচিতির জন্য প্রস্তুত স্লট">
        {['০১','০২','০৩'].map((number,index)=><article className={styles.candidatePlaceholder} key={number}>
          <span className={styles.candidateNumber}>{number}</span>
          <div className={styles.candidatePortrait} aria-hidden="true"><i/><b/></div>
          <div className={styles.candidatePlaceholderCopy}>
            <small>{index===0?'দাউদকান্দি':'ইউনিয়ন নির্বাচন'}</small>
            <strong>প্রার্থী ঘোষণা হলে পরিচিতি প্রকাশিত হবে</strong>
            <span>ছবি · ইউনিয়ন · সংক্ষিপ্ত পরিচয়</span>
          </div>
          <div className={styles.candidateBar}>OFFICIAL PROFILE <b>→</b></div>
        </article>)}
      </div>
    </section>

    <section className={styles.latestSection}>
      <div className={styles.sectionTop}><div><span className={styles.sectionKicker}>সর্বশেষ আপডেট</span><h2>সংবাদ ও কার্যক্রম</h2></div><Link href="/news">সব সংবাদ →</Link></div>
      <div className={styles.latestGrid}>{latest.map(({post,image})=><Link href={`/posts/${post.slug}`} className={styles.latestCard} key={post.id}>
        <div className={styles.latestImage}>{image?<img src={image} alt=""/>:<span>কুমিল্লা–১</span>}</div>
        <div className={styles.latestCopy}><small>{post.published_at?bnDate(post.published_at):'সংবাদ'}</small><h3>{post.title}</h3><p>{post.body.slice(0,120)}{post.body.length>120?'…':''}</p><b>পড়ুন →</b></div>
      </Link>)}</div>
    </section>

    <section className={styles.areaSection}>
      <div className={styles.sectionTop}><div><span className={styles.sectionKicker}>দাউদকান্দি — মেঘনা</span><h2>এলাকাকে জানুন</h2></div><Link href="/areas">সব এলাকা →</Link></div>
      <div className={styles.areaGrid}>{featuredAreas.map(area=>area&&<Link className={styles.areaCard} href={`/areas/${area.upazila}/${area.slug}`} key={area.id}>{area.image_url&&<img src={area.image_url} alt={`${area.name} এলাকার দৃশ্য`}/>}<i/><div><small>{area.upazila}</small><h3>{area.name}</h3><b>তথ্য দেখুন →</b></div></Link>)}</div>
    </section>
  </div>;
}
