import type {Metadata} from 'next';
import Link from 'next/link';
import type {SeoTopic} from '../lib/seo-topics';
import styles from './seo-topic-page.module.css';

const siteUrl='https://amar-cumilla1.vercel.app';

export function topicMetadata(topic:SeoTopic):Metadata{
  const url=siteUrl+topic.path;
  return {
    title:topic.title,
    description:topic.description,
    alternates:{canonical:url},
    openGraph:{type:'website',locale:'bn_BD',url,title:topic.title,description:topic.description,siteName:'Amar Cumilla–1'},
  };
}

export default function SeoTopicPage({topic}:{topic:SeoTopic}){
  const url=siteUrl+topic.path;
  const schema={
    '@context':'https://schema.org',
    '@graph':[
      {
        '@type':'CollectionPage',
        '@id':url+'#page',
        url,
        name:topic.heading,
        description:topic.description,
        inLanguage:'bn-BD',
        isPartOf:{'@type':'WebSite','@id':siteUrl+'/#website',name:'Amar Cumilla–1',url:siteUrl},
        about:topic.aliases.slice(0,6).map(name=>({'@type':'Thing',name})),
      },
      {
        '@type':'BreadcrumbList',
        itemListElement:[
          {'@type':'ListItem',position:1,name:'হোম',item:siteUrl+'/'},
          {'@type':'ListItem',position:2,name:'বিষয়ভিত্তিক তথ্য',item:siteUrl+'/topics'},
          {'@type':'ListItem',position:3,name:topic.label,item:url},
        ],
      },
    ],
  };
  const json=JSON.stringify(schema).replace(/</g,'\\u003c');
  return <article className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:json}}/>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">হোম</Link><span>›</span><Link href="/topics">বিষয়ভিত্তিক তথ্য</Link><span>›</span><b>{topic.label}</b></nav>
    <header className={styles.hero}><span className={styles.kicker}>TOPIC GUIDE</span><h1>{topic.heading}</h1><p>{topic.intro}</p></header>
    <section className={styles.section} aria-labelledby="topic-paths"><div className={styles.sectionHead}><div><span>দ্রুত দেখুন</span><h2 id="topic-paths">এই বিষয়ের গুরুত্বপূর্ণ অংশ</h2></div></div><div className={styles.cards}>{topic.related.map(item=><Link className={styles.card} href={item.href} key={item.href+item.label}><strong>{item.label}</strong><p>{item.description}</p><b>দেখুন →</b></Link>)}</div></section>
    <section className={`${styles.section} ${styles.aliasSection}`} aria-labelledby="common-names"><div className={styles.sectionHead}><div><span>নাম ও প্রচলিত বানান</span><h2 id="common-names">একই বিষয় যেভাবে লেখা হতে পারে</h2></div><p>মানুষ বাংলা, ইংরেজি বা ভিন্ন বানানে খুঁজতে পারে। নিচের নামগুলো একই বিষয় বোঝাতে সাধারণভাবে ব্যবহৃত হতে পারে।</p></div><div className={styles.aliases}>{topic.aliases.map(alias=><span key={alias}>{alias}</span>)}</div></section>
    <section className={styles.note}><strong>তথ্য ব্যবহারের নোট</strong><p>এই পাতা একটি বিষয়ভিত্তিক তথ্য-সূচি। কোনো ব্যক্তি, দল বা প্রতিষ্ঠানের সরকারি/অফিসিয়াল ওয়েবসাইট হিসেবে দাবি করা হচ্ছে না। সংবাদ, পরিচিতি ও নির্বাচনী তথ্যের ক্ষেত্রে সংশ্লিষ্ট প্রকাশনার উৎস ও হালনাগাদ অবস্থা দেখুন।</p><Link href="/editorial-policy">সম্পাদকীয় ও তথ্য যাচাই নীতি →</Link></section>
  </article>;
}
