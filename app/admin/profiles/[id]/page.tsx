import Link from 'next/link';
import {notFound} from 'next/navigation';
import ActionForm from '../../../../components/action-form';
import Icon from '../../../../components/admin-icon';
import {requireStaff} from '../../../../lib/supabase';
import type {Profile} from '../../../../lib/profiles';
import {saveProfile} from '../../profile-actions';

export default async function ProfileEditor({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{saved?:string;type?:string}>}){
 const {id}=await params;
 const search=await searchParams;
 const {db,role}=await requireStaff();
 const result=id==='new'?{data:null,error:null}:await db.from('cumilla_profiles').select('*').eq('id',id).maybeSingle();
 if(result.error)throw result.error;
 const p=result.data as Profile|null;
 if(id!=='new'&&!p)notFound();
 const initialType=p?.profile_type??(search.type==='responsible'?'responsible':'candidate');
 let image:string|null=null;
 if(p?.photo_path)image=(await db.storage.from('cumilla-media').createSignedUrl(p.photo_path,3600)).data?.signedUrl??null;
 else if(p?.photo_url)image='/media-proxy?url='+encodeURIComponent(p.photo_url);
 return <section>
  <div className="admin-page-header"><div><p className="eyebrow">{p?'পরিচিতি সম্পাদনা':'নতুন পরিচিতি'}</p><h1>{p?p.name:'প্রোফাইল তৈরি করুন'}</h1><p>ছবি, দায়িত্ব, এলাকা, জীবনী, শিক্ষা, পেশা ও যোগাযোগের তথ্য এক জায়গায় রাখুন।</p></div><div className="admin-page-actions">{search.saved&&<span className="admin-saved">সংরক্ষণ হয়েছে</span>}<Link className="admin-btn" href="/admin/profiles">← সব পরিচিতি</Link>{p?.status==='published'&&<Link className="admin-btn" href={'/profiles/'+p.slug} target="_blank"><Icon name="eye" size={17}/>লাইভ প্রোফাইল</Link>}</div></div>
  <ActionForm key={p?.updated_at??'new'} action={saveProfile} label="পরিচিতি সংরক্ষণ করুন" trackChanges uploadMode="profile">
   <input type="hidden" name="id" value={p?.id??''}/><input type="hidden" name="version" value={p?.updated_at??''}/><input type="hidden" name="existing_photo_path" value={p?.photo_path??''}/>
   <div className="studio-editor"><div className="studio-editor-main">
    <section className="admin-form-section"><div className="admin-form-section-head"><div><h2>মূল পরিচিতি</h2><p>কার পরিচিতি এবং কোথায় দায়িত্ব/প্রার্থিতা—এগুলো আগে দিন।</p></div><Icon name="users"/></div>
     <div className="admin-form-grid"><label>পরিচিতির ধরন<select name="profile_type" defaultValue={initialType}><option value="candidate">প্রার্থী পরিচিতি</option><option value="responsible">স্থানীয় দায়িত্বশীল</option></select></label><label>নাম<input name="name" required maxLength={180} defaultValue={p?.name??''} placeholder="পূর্ণ নাম"/></label><label>Slug<input name="slug" required maxLength={140} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={p?.slug??''} placeholder="name-or-area"/></label><label>পদবি / দায়িত্ব<input name="designation" maxLength={180} defaultValue={p?.designation??''} placeholder="যেমন: আমীর / সভাপতি / চেয়ারম্যান প্রার্থী"/></label><label>এলাকার নাম<input name="area_name" maxLength={180} defaultValue={p?.area_name??''} placeholder="যেমন: গৌরীপুর ইউনিয়ন"/></label><label>উপজেলা<select name="upazila" defaultValue={p?.upazila??''}><option value="">নির্বাচন করুন</option><option value="daudkandi">দাউদকান্দি</option><option value="meghna">মেঘনা</option></select></label><label>ইউনিয়ন / পৌরসভা<input name="union_name" maxLength={180} defaultValue={p?.union_name??''}/></label><label>পেশা<input name="profession" maxLength={500} defaultValue={p?.profession??''}/></label></div>
    </section>
    <section className="admin-form-section"><div className="admin-form-section-head"><div><h2>ছবি</h2><p>সরাসরি JPG, PNG বা WebP আপলোড করুন।</p></div><Icon name="image"/></div>{image&&<div style={{maxWidth:220,marginBottom:16}}><img src={image} alt="বর্তমান প্রোফাইল" style={{width:'100%',aspectRatio:'4/5',objectFit:'cover',borderRadius:16}}/></div>}<label>নতুন ছবি<input type="file" name="photo_file" accept="image/jpeg,image/png,image/webp"/></label><label>অথবা অনুমোদিত বাইরের ছবির URL<input type="url" name="photo_url" maxLength={2000} defaultValue={p?.photo_url??''} placeholder="https://..."/></label>{p&&(p.photo_path||p.photo_url)&&<label className="admin-inline-check"><input type="checkbox" name="clear_photo"/> বর্তমান ছবি সরিয়ে দিন</label>}</section>
    <section className="admin-form-section"><div className="admin-form-section-head"><div><h2>বিস্তারিত পরিচয়</h2><p>প্রোফাইল পেজে এগুলো সুন্দরভাবে দেখানো হবে।</p></div><Icon name="file"/></div><label>সংক্ষিপ্ত/পূর্ণ জীবনী<textarea name="bio" rows={9} maxLength={30000} defaultValue={p?.bio??''} placeholder="ব্যক্তিগত ও জনসেবামূলক পরিচিতি..."/></label><label>শিক্ষাগত যোগ্যতা<textarea name="education" rows={4} maxLength={3000} defaultValue={p?.education??''}/></label></section>
    <section className="admin-form-section"><div className="admin-form-section-head"><h2>যোগাযোগ ও তথ্যসূত্র</h2><Icon name="link"/></div><div className="admin-form-grid"><label>ফোন<input name="phone" maxLength={80} defaultValue={p?.phone??''}/></label><label>ইমেইল<input type="email" name="email" maxLength={180} defaultValue={p?.email??''}/></label><label>Facebook<input type="url" name="facebook_url" maxLength={2000} defaultValue={p?.facebook_url??''} placeholder="https://..."/></label><label>ওয়েবসাইট<input type="url" name="website_url" maxLength={2000} defaultValue={p?.website_url??''} placeholder="https://..."/></label><label>তথ্যসূত্র<input type="url" name="source_url" maxLength={2000} defaultValue={p?.source_url??''} placeholder="https://..."/></label></div></section>
   </div><aside className="studio-editor-side"><div className="admin-form-section studio-publish-box"><h2 style={{marginTop:0}}>প্রকাশের সেটিংস</h2><label>অবস্থা<select name="status" defaultValue={p?.status??'draft'}><option value="draft">খসড়া</option>{role!=='editor'&&<option value="published">প্রকাশিত</option>}<option value="archived">আর্কাইভ</option></select></label><label>ক্রম<input type="number" name="sort_order" min={0} max={9999} defaultValue={p?.sort_order??0}/><span className="admin-help">ছোট সংখ্যা আগে দেখাবে।</span></label><label className="admin-inline-check"><input type="checkbox" name="featured" defaultChecked={p?.featured??true}/> হোমপেজে দেখান</label><div className="studio-publish-check"><Icon name="check" size={17}/><span>প্রকাশিত হলে হোমপেজ ও পরিচিতি পেজে দেখা যাবে</span></div></div><div className="studio-note"><strong>সেরা ফলের জন্য</strong><p>একই অনুপাতের পরিষ্কার পোর্ট্রেট ছবি, ছোট পদবি এবং নির্দিষ্ট এলাকা ব্যবহার করুন।</p></div></aside></div>
  </ActionForm>
 </section>;
}
