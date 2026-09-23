import Link from 'next/link';
import {requireStaff} from '../../../lib/supabase';
import Icon from '../../../components/admin-icon';

const typeNames={candidate:'প্রার্থী পরিচিতি',responsible:'স্থানীয় দায়িত্বশীল'};
const statusNames={draft:'খসড়া',published:'প্রকাশিত',archived:'আর্কাইভ'};

export default async function Profiles({searchParams}:{searchParams:Promise<{type?:string;status?:string;q?:string}>}){
 const {db}=await requireStaff();
 const params=await searchParams;
 const type=Object.hasOwn(typeNames,params.type??'')?params.type??'':'';
 const status=Object.hasOwn(statusNames,params.status??'')?params.status??'':'';
 const q=(params.q??'').trim().slice(0,80);
 let query=db.from('cumilla_profiles').select('id,name,slug,profile_type,designation,area_name,union_name,status,photo_path,photo_url,updated_at',{count:'exact'});
 if(type)query=query.eq('profile_type',type);
 if(status)query=query.eq('status',status);
 if(q)query=query.ilike('name',`%${q}%`);
 const {data,error,count}=await query.order('sort_order',{ascending:true}).order('updated_at',{ascending:false});
 if(error)throw error;
 const rows=await Promise.all((data??[]).map(async p=>({
  ...p,
  image:p.photo_path?(await db.storage.from('cumilla-media').createSignedUrl(p.photo_path,3600)).data?.signedUrl:p.photo_url?'/media-proxy?url='+encodeURIComponent(p.photo_url):null,
 })));
 return <section>
  <div className="admin-page-header"><div><p className="eyebrow">পরিচিতি ব্যবস্থাপনা</p><h1>{type?typeNames[type as keyof typeof typeNames]:'সব পরিচিতি'}</h1><p>প্রার্থী ও স্থানীয় দায়িত্বশীলদের প্রোফাইল যত ইচ্ছা যোগ, সম্পাদনা ও প্রকাশ করুন।</p></div><div className="admin-page-actions"><Link className="admin-btn primary" href={'/admin/profiles/new'+(type?'?type='+type:'')}><Icon name="plus" size={18}/>নতুন পরিচিতি</Link></div></div>
  <nav className="studio-tabs" aria-label="পরিচিতির ধরন">{[['','সব'],...Object.entries(typeNames)].map(([key,label])=><Link key={key} href={key?`/admin/profiles?type=${key}`:'/admin/profiles'} aria-current={type===key?'page':undefined}>{label}</Link>)}</nav>
  <div className="admin-toolbar"><form className="admin-filters" method="get"><input name="q" defaultValue={q} placeholder="নাম দিয়ে খুঁজুন…"/>{type&&<input type="hidden" name="type" value={type}/>}<select name="status" defaultValue={status}><option value="">সব অবস্থা</option>{Object.entries(statusNames).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select><button type="submit">খুঁজুন</button>{(q||status)&&<Link className="admin-filter-reset" href={type?`/admin/profiles?type=${type}`:'/admin/profiles'}>রিসেট</Link>}</form></div>
  <p className="studio-result-count">{(count??0).toLocaleString('bn-BD')}টি পরিচিতি</p>
  <div className="admin-table">{rows.map(p=><Link className="admin-row" href={'/admin/profiles/'+p.id} key={p.id}>{p.image?<img className="studio-thumb" src={p.image} alt=""/>:<span className="studio-thumb"><Icon name="users"/></span>}<div className="admin-row-title"><strong>{p.name}</strong><small>{p.designation||p.area_name||p.union_name||'পরিচিতির তথ্য'}</small></div><span className="admin-row-kind">{typeNames[p.profile_type as keyof typeof typeNames]}</span><span className={'admin-status '+p.status}>{statusNames[p.status as keyof typeof statusNames]}</span><span className="admin-row-arrow"><Icon name="arrow" size={18}/></span></Link>)}{!rows.length&&<div className="admin-empty"><Icon name="users" size={30}/><p>এখনও কোনো পরিচিতি যোগ করা হয়নি।</p><Link className="admin-btn primary" href={'/admin/profiles/new'+(type?'?type='+type:'')}>প্রথম পরিচিতি যোগ করুন</Link></div>}</div>
 </section>;
}
