import ContentImage from '../components/content-image';
import {postCoverPath} from '../lib/post-cover';
import type {Metadata} from 'next';
import Link from 'next/link';
import {bnDate,getAreas,getPosts,mediaUrl,type Post} from '../lib/content';
import {getElectionOverview,getElectionSettings} from '../lib/election';
import {getProfiles,profileArea,profilePhoto} from '../lib/profiles';
import ElectionLiveRefresh from '../components/election-live-refresh';
import styles from './home-modern.module.css';
import people from './home-profiles.module.css';
import engage from './home-engagement.module.css';

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
  const raw=postCoverPath(post);
  return raw?await mediaUrl(raw):null;
}

const featureLinks=[
  ['▤','LATEST NEWS','/news'],
  ['●●●','COMMUNITY ACTIVITIES','/sections/event'],
  ['◆','AREA UPDATES','/areas'],
  ['●●','LOCAL LEADERSHIP','/profiles?type=responsible'],
] as const;

export default async function Home(){
  const [{posts:news},areas,electionSettings,responsibleProfiles,candidateProfiles]=await Promise.all([
    getPosts('news'),getAreas(),getElectionSettings(),getProfiles('responsible'),getProfiles('candidate'),
  ]);
  const liveElection=!!electionSettings?.live_mode&&!!electionSettings?.public_enabled;
  const electionOverview=liveElection?await getElectionOverview():[];
  const items=await Promise.all(news.slice(0,12).map(async post=>({post,image:await postImage(post)})));
  const latest=items.filter(item=>item.image).slice(0,5);
  const responsibleItems=await Promise.all(responsibleProfiles.filter(p=>p.featured).map(async profile=>({profile,image:await profilePhoto(profile)})));
  const candidateItems=await Promise.all(candidateProfiles.filter(p=>p.featured).map(async profile=>({profile,image:await profilePhoto(profile)})));
  const featuredAreas=['municipality','gouripur','manikarchar','govindapur'].map(slug=>areas.find(area=>area.slug===slug)).filter(Boolean);

  return <div className={styles.page}>
    {liveElection&&<>
      <ElectionLiveRefresh seconds={15}/>
      <section className={styles.liveTakeover} aria-labelledby="live-result-title">
        <div className={styles.liveTakeoverHead}><div><span className={styles.liveBadge}><i/> LIVE RESULT</span><h2 id="live-result-title">{electionSettings?.headline}</h2><p>দাউদকান্দি ও মেঘনার ইউনিয়নভিত্তিক ফলাফল। নতুন কেন্দ্রের ফল সংরক্ষণ হলে এই অংশ স্বয়ংক্রিয়ভাবে আপডেট হবে।</p></div><Link href="/election">সব ইউনিয়নের ফল →</Link></div>
        {electionOverview.length?<div className={styles.liveUnionRail}>{electionOverview.slice(0,6).map(item=>{
          const pct=item.centresTotal?Math.round(item.centresReported/item.centresTotal*100):0;
          const leader=item.candidates[0];
          return <Link href={`/election/${item.election.upazila}/${item.election.union_slug}`} className={styles.liveUnionCard} key={item.election.id}>
            <small>{item.election.upazila==='daudkandi'?'দাউদকান্দি':'মেঘনা'}</small><h3>{item.election.union_name}</h3><div className={styles.liveUnionProgress}><span style={{width:`${pct}%`}}/></div><b>{item.centresReported}/{item.centresTotal} কেন্দ্র</b>{leader?<p><strong>{leader.name}</strong><span>{leader.votes.toLocaleString('bn-BD')} ভোট</span></p>:<p><strong>প্রার্থী যোগ করা হয়নি</strong><span>ফলাফল প্রকাশের অপেক্ষায়</span></p>}<em>বিস্তারিত ফল →</em>
          </Link>})}</div>:<div className={styles.liveEmpty}><strong>লাইভ ফলাফল চালু আছে</strong><span>ইউনিয়নভিত্তিক ফল প্রকাশ শুরু হলে এখানে দেখা যাবে।</span></div>}
        <p className={styles.liveDisclaimer}>{electionSettings?.note}</p>
      </section>
    </>}

    <section className={styles.hero}>
      <div className={styles.heroGlow}/>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}><span>AMAR</span><h1>CUMILLA–1</h1><strong>DAUDKANDI &amp; MEGHNA</strong></div>
        <div className={styles.heroNote}><span>LOCAL INFORMATION</span><b>People · Community · Area</b></div>
        <div className={styles.heroCollage} aria-label="কুমিল্লা-১ এলাকার স্থানীয় কার্যক্রম"><figure className={`${styles.heroPhoto} ${styles.heroPhotoMain}`}><img src="/home-hero-image" alt="কুমিল্লা-১ এলাকার মানুষের সঙ্গে স্থানীয় কার্যক্রম" fetchPriority="high"/></figure><figure className={`${styles.heroPhoto} ${styles.heroPhotoSmall}`}><img src="/march-image" alt="দাউদকান্দিতে স্থানীয় জনসমাগম ও কার্যক্রমের দৃশ্য"/></figure></div>
        <p className={styles.heroIntro}>Verified local news, community leadership, community initiatives, and area updates in one place.</p>
        <div className={styles.featureStrip}>{featureLinks.map(([icon,label,href])=><Link href={href} key={href}><i>{icon}</i><span>{label}</span></Link>)}</div>
      </div>
    </section>

    <section className={`${people.peopleSection} ${people.peopleLeadership}`} aria-labelledby="leadership-title">
      <div className={people.peopleHead}><div><span className={people.peopleKicker}>LOCAL LEADERSHIP</span><h2 id="leadership-title">স্থানীয় দায়িত্বশীলদের পরিচিতি</h2><p>দাউদকান্দি ও মেঘনার প্রকাশিত দায়িত্বশীলদের ছবি, দায়িত্ব, এলাকা ও সংক্ষিপ্ত পরিচয় পাশাপাশি দেখুন।</p></div><Link href="/profiles?type=responsible">সব পরিচিতি →</Link></div>
      {responsibleItems.length?<div className={people.peopleRail}>{responsibleItems.map(({profile,image})=><Link href={'/profiles/'+profile.slug} className={people.peopleCard} key={profile.id}><div className={people.peoplePhoto}>{image?<img src={image} alt={profile.name}/>:<span>{profile.name.slice(0,1)}</span>}</div><div className={people.peopleCopy}><small>স্থানীয় দায়িত্বশীল</small><h3>{profile.name}</h3>{profile.designation&&<strong>{profile.designation}</strong>}<p>{profileArea(profile)||'কুমিল্লা–১'}</p></div><div className={people.peopleBar}>PROFILE <b>→</b></div></Link>)}</div>:<div className={people.peopleEmpty}><strong>পরিচিতি প্রস্তুত হচ্ছে</strong><span>প্রকাশিত স্থানীয় দায়িত্বশীলদের পরিচিতি এখানে দেখা যাবে।</span></div>}
    </section>

    <section className={styles.motto}><span/> <p>“দাউদকান্দি ও মেঘনার তথ্য এক জায়গায়”</p> <span/></section>

    <section className={`${people.peopleSection} ${people.peopleCandidates}`} aria-labelledby="candidate-title">
      <div className={people.peopleHead}><div><span className={people.peopleKicker}>CANDIDATE PROFILE</span><h2 id="candidate-title">প্রার্থী পরিচিতি</h2><p>দাউদকান্দি ও মেঘনার প্রকাশিত প্রার্থীদের ছবি, এলাকা, পদবি ও বিস্তারিত পরিচয় এখানে একসঙ্গে দেখুন।</p></div><Link href="/profiles?type=candidate">সব প্রার্থী →</Link></div>
      {candidateItems.length?<div className={people.peopleRail}>{candidateItems.map(({profile,image})=><Link href={'/profiles/'+profile.slug} className={people.peopleCard} key={profile.id}><div className={people.peoplePhoto}>{image?<img src={image} alt={profile.name}/>:<span>{profile.name.slice(0,1)}</span>}</div><div className={people.peopleCopy}><small>প্রার্থী পরিচিতি</small><h3>{profile.name}</h3>{profile.designation&&<strong>{profile.designation}</strong>}<p>{profileArea(profile)||'কুমিল্লা–১'}</p></div><div className={people.peopleBar}>OFFICIAL PROFILE <b>→</b></div></Link>)}</div>:<div className={people.peopleEmpty}><strong>এখনও কোনো প্রার্থী পরিচিতি প্রকাশিত হয়নি</strong><span>প্রার্থী তালিকা প্রকাশিত হলে এখানে দেখা যাবে।</span></div>}
    </section>

    <section className={engage.section} aria-labelledby="engagement-title">
      <div className={engage.head}><span>আপনার অংশগ্রহণ</span><h2 id="engagement-title">আপনার কথা সরাসরি আমাদের কাছে</h2><p>যোগদানের আগ্রহ, এলাকার সমস্যা অথবা গঠনমূলক মতামত—সঠিক ফর্মটি বেছে পাঠান। জমা হওয়া তথ্য প্রয়োজন অনুযায়ী অনুমোদিত দায়িত্বশীলদের কাছে পৌঁছাবে।</p></div>
      <div className={engage.grid}><Link href="/join" className={`${engage.card} ${engage.join}`}><i>01</i><small>JOIN</small><h3>জামায়াতে ইসলামী সম্পর্কে জানতে ও যুক্ত হওয়ার আগ্রহ</h3><p>যোগাযোগের তথ্য ও আগ্রহ জানান। এটি সরাসরি সদস্যপদ অনুমোদন নয়।</p><b>ফর্ম খুলুন →</b></Link><Link href="/report-problem" className={`${engage.card} ${engage.problem}`}><i>02</i><small>LOCAL ISSUE</small><h3>এলাকার সমস্যা জানান</h3><p>রাস্তা, পানি, ড্রেনেজ, শিক্ষা, স্বাস্থ্য বা অন্য স্থানীয় সমস্যা বিস্তারিত লিখুন।</p><b>সমস্যা জানান →</b></Link><Link href="/feedback" className={`${engage.card} ${engage.feedback}`}><i>03</i><small>YOUR VOICE</small><h3>মতামত ও পরামর্শ দিন</h3><p>এলাকার উন্নয়ন, জনসেবা বা ওয়েবসাইট সম্পর্কে গঠনমূলক মতামত পাঠান।</p><b>মতামত দিন →</b></Link></div>
    </section>

    <section className={styles.latestSection}>
      <div className={styles.sectionTop}><div><span className={styles.sectionKicker}>সর্বশেষ আপডেট</span><h2>সংবাদ ও কার্যক্রম</h2></div><Link href="/news">সব সংবাদ →</Link></div>
      <div className={styles.latestGrid}>{latest.map(({post,image})=><Link href={`/posts/${post.slug}`} className={styles.latestCard} key={post.id}><div className={styles.latestImage}>{image?<ContentImage key={image} src={image} alt={post.title}/>:<span>ঘটনার ছবি যুক্ত হয়নি</span>}</div><div className={styles.latestCopy}><small>{post.published_at?bnDate(post.published_at):'সংবাদ'}</small><h3>{post.title}</h3><p>{post.body.slice(0,120)}{post.body.length>120?'…':''}</p><b>পড়ুন →</b></div></Link>)}</div>
    </section>

    <section className={styles.areaSection}>
      <div className={styles.sectionTop}><div><span className={styles.sectionKicker}>দাউদকান্দি — মেঘনা</span><h2>এলাকাকে জানুন</h2></div><Link href="/areas">সব এলাকা →</Link></div>
      <div className={styles.areaGrid}>{featuredAreas.map(area=>area&&<Link className={styles.areaCard} href={`/areas/${area.upazila}/${area.slug}`} key={area.id}>{area.image_url&&<img src={area.image_url} alt={`${area.name} এলাকার দৃশ্য`}/>}<i/><div><small>{area.upazila}</small><h3>{area.name}</h3><b>তথ্য দেখুন →</b></div></Link>)}</div>
    </section>
  </div>;
}
