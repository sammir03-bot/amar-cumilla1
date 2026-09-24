import Link from 'next/link';
import Form from 'next/form';
import {requireStaff} from '../../../lib/supabase';
import {profilePhotos,type Profile} from '../../../lib/profiles';
import Icon from '../../../components/admin-icon';
import ContentImage from '../../../components/content-image';
import ProfileStatusAction from '../../../components/profile-status-action';

const typeNames={candidate:'প্রার্থী পরিচিতি',responsible:'স্থানীয় দায়িত্বশীল'};
const statusNames={draft:'খসড়া',published:'প্রকাশিত',archived:'আর্কাইভ'};
const pageSize=24;
export default async function Profiles({searchParams}:{searchParams:Promise<{type?:string;status?:string;q?:string;page?:string}>}){
 const [{db,role},params]=await Promise.all([requireStaff(),searchParams]);
 const type=Object.hasOwn(typeNames,params.type??'')?params.type??'':'';
 const status=Object.hasOwn(statusNames,params.status??'')?params.status??'':'';
 const q=(params.q??'').trim().slice(0,80),page=Math.max(1,Math.min(10000,Number.parseInt(params.page??'1',10)||1));
 let query=db.from('cumilla_profiles').select('id,name,slug,profile_type,designation,area_name,union_name,upazila,status,featured,photo_path,photo_url,updated_at',{count:'exact'});
 if(type)query=query.eq('profile_type',type);
 if(status)query=query.eq('status',status);
 if(q)query=query.ilike('name',`%${q.replace(/[\\%_]/g,'\\$&')}%`);
 const {data,error,count}=await query.order('sort_order',{ascending:true}).order('updated_at',{ascending:false}).order('id').range((page-1)*pageSize,page*pageSize-1);
 if(error)throw new Error('পরিচিতি আনা যায়নি। আবার চেষ্টা করুন।');
 const rows=await profilePhotos((data??[]) as Profile[],db);
 const url=(changes:Record<string,string>)=>{const p=new URLSearchParams({...(type?{type}:{}),...(status?{status}:{}),...(q?{q}:{}),...changes});return '/admin/profiles'+(p.size?'?'+p.toString():'');};
 return <section className="profile-workspace">
  <div className="admin-page-header"><div><p className="eyebrow">মানুষ ও পরিচিতি</p><h1>{type?typeNames[type as keyof typeof typeNames]:'প্রার্থী ও দায়িত্বশীল'}</h1><p>পরিচিতি যোগ করুন, ছবি বদলান এবং এক ক্লিকে প্রকাশ করুন।</p></div><div className="admin-page-actions"><Link className="admin-btn" href="/profiles" target="_blank"><Icon name="eye" size={17}/>ওয়েবসাইটে দেখুন</Link><Link className="admin-btn primary" href={'/admin/profiles/new'+(type?'?type='+type:'')}><Icon name="plus" size={18}/>নতুন পরিচিতি</Link></div></div>
  <nav className="studio-tabs" aria-label="পরিচিতির ধরন">{[['','সব পরিচিতি'],...Object.entries(typeNames)].map(([key,label])=><Link key={key} href={key?`/admin/profiles?type=${key}`:'/admin/profiles'} aria-current={type===key?'page':undefined}>{label}</Link>)}</nav>
  <div className="admin-toolbar"><Form action="/admin/profiles" className="admin-filters"><input aria-label="পরিচিতির নাম খুঁজুন" name="q" defaultValue={q} placeholder="নাম দিয়ে খুঁজুন…"/>{type&&<input type="hidden" name="type" value={type}/>}<select aria-label="প্রকাশের অবস্থা" name="status" defaultValue={status}><option value="">সব অবস্থা</option>{Object.entries(statusNames).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select><button type="submit">খুঁজুন</button>{(q||status)&&<Link className="admin-filter-reset" href={type?`/admin/profiles?type=${type}`:'/admin/profiles'}>রিসেট</Link>}</Form></div>
  <div className="profile-list-heading"><p className="studio-result-count">{(count??0).toLocaleString('bn-BD')}টি পরিচিতি</p><span>শুধু প্রকাশিত পরিচিতি দর্শক দেখতে পান</span></div>
  <div className="profile-admin-grid">{rows.map(({profile:p,image})=><article className="profile-admin-card" key={p.id}><div className="profile-card-top"><Link href={'/admin/profiles/'+p.id} className="profile-avatar">{image?<ContentImage src={image} alt={p.name}/>:<Icon name="users" size={28}/>}</Link><div><span className="profile-type-label">{typeNames[p.profile_type]}</span><h2><Link href={'/admin/profiles/'+p.id}>{p.name}</Link></h2><p>{p.designation||'পদবি যুক্ত করুন'}</p>{(p.area_name||p.union_name)&&<small>{p.area_name||p.union_name}</small>}</div></div><div className="profile-visibility"><span className={'admin-status '+p.status}>{statusNames[p.status]}</span><span>{p.status==='published'?(p.featured?'হোমপেজে দেখা যাচ্ছে':'শুধু পরিচিতি তালিকায়'):'হোমপেজে দেখা যাচ্ছে না'}</span></div><div className="profile-card-actions"><Link className="admin-btn" href={'/admin/profiles/'+p.id}>সম্পাদনা</Link><Link className="admin-btn" href={'/admin/profiles/'+p.id+'/preview'}>প্রিভিউ</Link>{role!=='editor'&&<ProfileStatusAction key={p.updated_at} id={p.id} version={p.updated_at} status={p.status} featured={p.featured}/>}</div></article>)}{!rows.length&&<div className="admin-empty"><Icon name="users" size={30}/><h2>{q||status?'এই অনুসন্ধানে পরিচিতি নেই':'নতুন পরিচিতি দিয়ে শুরু করুন'}</h2><p>{q||status?'নাম বা প্রকাশের অবস্থা বদলে আবার খুঁজুন।':'ছবি, নাম ও পরিচয় যোগ করে প্রকাশ করলে হোমে কার্ড দেখা যাবে।'}</p>{q||status?<Link className="admin-btn" href="/admin/profiles">সব পরিচিতি দেখুন</Link>:<Link className="admin-btn primary" href={'/admin/profiles/new'+(type?'?type='+type:'')}>পরিচিতি যোগ করুন</Link>}</div>}</div>
  {(count??0)>pageSize&&<nav className="admin-pagination" aria-label="পরিচিতির পাতা">{page>1?<Link href={url({page:String(page-1)})}>← আগের পাতা</Link>:<span/>}<span>পাতা {page.toLocaleString('bn-BD')}</span>{page*pageSize<(count??0)&&<Link href={url({page:String(page+1)})}>পরের পাতা →</Link>}</nav>}
 </section>;
}
