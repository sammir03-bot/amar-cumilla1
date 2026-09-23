import {postCoverPath} from '../lib/post-cover';
import ContentImage from './content-image';
import Link from 'next/link';
import {Post,bnDate,kinds,mediaUrl} from '../lib/content';
import styles from './posts.module.css';

function isExternal(path:string){return /^https:\/\//i.test(path);}

export async function PostCards({posts}:{posts:Post[]}){
  if(!posts.length)return <p className="notice">এই বিভাগে এখনো কোনো তথ্য প্রকাশিত হয়নি।</p>;
  const cards=await Promise.all(posts.map(async p=>{
    const imagePath=postCoverPath(p);
    const imageUrl=imagePath?await mediaUrl(imagePath):null;
    return {p,imageUrl};
  }));
  return <div className="grid">{cards.map(({p,imageUrl})=><Link className={`card ${styles.card}`} key={p.id} href={'/posts/'+p.slug}>
    <div className={styles.cover}>
      {imageUrl&&<><ContentImage key={imageUrl} className={styles.coverImage} src={imageUrl} alt={p.title}/><span className={styles.coverShade}/></>}
      <div className={styles.coverInner}>
        <span className={styles.coverBadge}>{kinds[p.kind]}</span>
        {!imageUrl&&<span style={{fontSize:14,color:"#dbe9e4"}}>ঘটনার ছবি যুক্ত হয়নি</span>}
      </div>
    </div>
    <div className={styles.content}>
      <small>{p.published_at?bnDate(p.published_at):kinds[p.kind]}{p.venue?' · '+p.venue:''}</small>
      <h2>{p.title}</h2>
      <p>{p.body.slice(0,150)}{p.body.length>150?'…':''}</p>
      <span className={styles.readMore}>বিস্তারিত পড়ুন →</span>
    </div>
  </Link>)}</div>;
}

export async function PostView({post:p,sign=mediaUrl}:{post:Post;sign?:(path:string)=>Promise<string|null>}){
  const files=await Promise.all((p.media_paths??[]).map(async path=>({path,url:await sign(path)})));
  const coverPath=postCoverPath(p);
  const cover=coverPath?(isExternal(coverPath)?await mediaUrl(coverPath):await sign(coverPath)):null;
  return <article className="prose">
    <p className="eyebrow">{kinds[p.kind]}{p.published_at?' · '+bnDate(p.published_at):''}</p>
    <h1>{p.title}</h1>
    {cover&&<figure className={styles.articleCover}><ContentImage key={cover} src={cover} alt={p.title} loading="eager"/>{(p.cover_credit||p.cover_source_url)&&<figcaption>{p.cover_credit||'ছবির উৎস'}{p.cover_license?` · ${p.cover_license}`:''}{p.cover_source_url&&<> · <a href={p.cover_source_url} target="_blank" rel="noopener noreferrer">ছবির উৎস ↗</a></>}</figcaption>}</figure>}
    {p.event_at&&<p>সময়: {new Date(p.event_at).toLocaleString('bn-BD',{timeZone:'Asia/Dhaka'})} (বাংলাদেশ)</p>}
    {p.venue&&<p>স্থান: {p.venue}</p>}
    <div className="body-text">{p.body}</div>
    {p.source_url&&<div className={styles.sourceBox}><span><small>তথ্যসূত্র</small><strong>{p.source_name||'মূল প্রকাশনা'}</strong></span><a href={p.source_url} target="_blank" rel="noopener noreferrer">উৎস দেখুন ↗</a></div>}
    <div className="media-grid">{files.map(f=>f.path!==coverPath&&f.url&&!isExternal(f.path)?(f.path.endsWith('.pdf')?<a className="button secondary" key={f.path} href={f.url} target="_blank" rel="noopener noreferrer">PDF পড়ুন ↗</a>:<img key={f.path} src={f.url} alt={p.title+' — সংযুক্ত ছবি'} loading="lazy"/>):null)}</div>
  </article>;
}
