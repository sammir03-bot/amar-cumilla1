import Link from 'next/link';
import Icon from '../../../components/admin-icon';
import {kinds} from '../../../lib/content';
import {postCoverPath} from '../../../lib/post-cover';
import {requireStaff} from '../../../lib/supabase';

const profileTypeNames:Record<string,string>={candidate:'প্রার্থী',responsible:'দায়িত্বশীল'};

export default async function QualityCenter(){
 const {db}=await requireStaff();
 const [postsResult,profilesResult,areasResult]=await Promise.all([
  db.from('cumilla_posts').select('id,title,kind,body,source_url,cover_url,media_paths,cover_selection,updated_at').eq('status','published').order('updated_at',{ascending:false}).limit(150),
  db.from('cumilla_profiles').select('id,name,profile_type,designation,area_name,union_name,upazila,bio,photo_path,photo_url,updated_at').eq('status','published').order('updated_at',{ascending:false}).limit(150),
  db.from('cumilla_areas').select('id,name,description,services,verified_at,published,updated_at').eq('published',true).order('updated_at',{ascending:false}).limit(100),
 ]);
 if(postsResult.error||profilesResult.error||areasResult.error)throw new Error('মান যাচাইয়ের তথ্য আনা যায়নি।');
 const posts=postsResult.data??[],profiles=profilesResult.data??[],areas=areasResult.data??[];
 const missingPhoto=posts.filter(post=>!postCoverPath(post));
 const missingSource=posts.filter(post=>['news','document','archive'].includes(post.kind)&&!post.source_url);
 const shortCopy=posts.filter(post=>(post.body??'').trim().length<160);
 const incompleteProfiles=profiles.filter(profile=>{
  const hasPhoto=!!(profile.photo_path||profile.photo_url);
  const hasArea=!!(profile.area_name||profile.union_name||profile.upazila);
  return !hasPhoto||!profile.designation||!hasArea||(profile.bio??'').trim().length<80;
 });
 const incompleteAreas=areas.filter(area=>!area.verified_at||(area.description??'').trim().length<80||(area.services??'').trim().length<20);
 const totalIssues=missingPhoto.length+missingSource.length+shortCopy.length+incompleteProfiles.length+incompleteAreas.length;
 const score=Math.max(0,100-Math.min(100,totalIssues*3));
 const checks=[
  {label:'ছবি বাকি',count:missingPhoto.length,detail:'প্রকাশিত কনটেন্ট',href:'/admin/content?photo=missing',icon:'image'},
  {label:'উৎস বাকি',count:missingSource.length,detail:'সংবাদ/ডকুমেন্ট',href:'#source-check',icon:'link'},
  {label:'লেখা ছোট',count:shortCopy.length,detail:'১৬০ অক্ষরের কম',href:'#copy-check',icon:'file'},
  {label:'পরিচিতি অসম্পূর্ণ',count:incompleteProfiles.length,detail:'ছবি/পদবি/এলাকা/বায়ো',href:'#profile-check',icon:'users'},
 ];
 const Row=({href,title,meta}:{href:string;title:string;meta:string})=><Link className="studio-list-item" href={href}><span className="studio-thumb"><Icon name="check"/></span><span className="studio-list-copy"><strong>{title}</strong><small>{meta}</small></span><span className="admin-row-arrow"><Icon name="arrow" size={18}/></span></Link>;
 return <section>
  <div className="admin-page-header"><div><p className="eyebrow">QUALITY CONTROL</p><h1>মান যাচাই কেন্দ্র</h1><p>প্রকাশিত তথ্যের ছবি, উৎস, লেখা ও পরিচিতির অসম্পূর্ণতা দ্রুত খুঁজে ঠিক করুন।</p></div><div className="admin-page-actions"><Link className="admin-btn" href="/" target="_blank"><Icon name="external" size={17}/>সাইট দেখুন</Link><Link className="admin-btn primary" href="/admin/content"><Icon name="file" size={17}/>কনটেন্ট খুলুন</Link></div></div>
  <div className="studio-stats"><div className="studio-stat featured"><div className="studio-stat-top"><span>মান স্কোর</span><span className="studio-stat-icon"><Icon name="check"/></span></div><strong>{score.toLocaleString('bn-BD')}%</strong><small>সাম্প্রতিক প্রকাশিত তথ্যের ভিত্তিতে</small></div>{checks.map(check=><Link className="studio-stat" href={check.href} key={check.label}><div className="studio-stat-top"><span>{check.label}</span><span className="studio-stat-icon"><Icon name={check.icon}/></span></div><strong>{check.count.toLocaleString('bn-BD')}</strong><small>{check.detail}</small></Link>)}</div>
  <div className="studio-dashboard">
   <div className="admin-panel" id="source-check"><div className="admin-panel-head"><h2>উৎস/রেফারেন্স বাকি</h2><span>{missingSource.length.toLocaleString('bn-BD')}</span></div><div className="studio-list">{missingSource.slice(0,8).map(post=><Row key={post.id} href={'/admin/content/'+post.id} title={post.title} meta={`${kinds[post.kind]??post.kind} · উৎসের লিংক যোগ করুন`}/>)}{!missingSource.length&&<p className="admin-empty">এই যাচাইয়ে কোনো ঘাটতি পাওয়া যায়নি।</p>}</div></div>
   <aside className="studio-rail"><div className="admin-panel" id="copy-check"><div className="admin-panel-head"><h2>লেখা খুব ছোট</h2><span>{shortCopy.length.toLocaleString('bn-BD')}</span></div><div className="studio-list">{shortCopy.slice(0,6).map(post=><Row key={post.id} href={'/admin/content/'+post.id} title={post.title} meta={`${(post.body??'').trim().length.toLocaleString('bn-BD')} অক্ষর`}/>)}{!shortCopy.length&&<p className="admin-empty">সব লেখায় যথেষ্ট বিস্তারিত আছে।</p>}</div></div></aside>
  </div>
  <div className="studio-dashboard">
   <div className="admin-panel" id="profile-check"><div className="admin-panel-head"><h2>পরিচিতি অসম্পূর্ণ</h2><Link href="/admin/profiles">সব পরিচিতি →</Link></div><div className="studio-list">{incompleteProfiles.slice(0,8).map(profile=><Row key={profile.id} href={'/admin/profiles/'+profile.id} title={profile.name} meta={`${profileTypeNames[profile.profile_type]??'পরিচিতি'} · ছবি, পদবি, এলাকা ও বায়ো যাচাই করুন`}/>)}{!incompleteProfiles.length&&<p className="admin-empty">প্রকাশিত পরিচিতিগুলো পূর্ণ আছে।</p>}</div></div>
   <aside className="studio-rail"><div className="admin-panel"><div className="admin-panel-head"><h2>এলাকার তথ্য যাচাই</h2><Link href="/admin/areas">সব এলাকা →</Link></div><div className="studio-list">{incompleteAreas.slice(0,6).map(area=><Row key={area.id} href={'/admin/areas/'+area.id} title={area.name} meta={!area.verified_at?'যাচাইয়ের তারিখ নেই':'বর্ণনা বা সেবা তথ্য অসম্পূর্ণ'}/>)}{!incompleteAreas.length&&<p className="admin-empty">প্রকাশিত এলাকার তথ্য পূর্ণ ও যাচাইকৃত।</p>}</div></div></aside>
  </div>
  <div className="studio-note"><strong>মান স্কোর কীভাবে কাজ করে?</strong><p>এটি সম্পাদকীয় সহায়ক সূচক—কোনো রাজনৈতিক বা বিষয়গত মূল্যায়ন নয়। ছবি, উৎস, পর্যাপ্ত লেখা, পরিচিতি ও যাচাইকৃত এলাকার তথ্যের মতো প্রকাশনা-মানের ঘাটতি দ্রুত ধরতে ব্যবহার করুন।</p></div>
 </section>;
}
