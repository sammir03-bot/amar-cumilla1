import Link from 'next/link';
import {notFound} from 'next/navigation';
import {z} from 'zod';
import ActionForm from '../../../../components/action-form';
import Icon from '../../../../components/admin-icon';
import ProfilePhotoEditor from '../../../../components/profile-photo-editor';
import ProfileSubmit,{ProfileArchive} from '../../../../components/profile-submit';
import {requireStaff} from '../../../../lib/supabase';
import {profilePhotos,type Profile} from '../../../../lib/profiles';
import {saveProfile} from '../../profile-actions';

export default async function ProfileEditor({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{saved?:string;type?:string}>}){
 const [{id},search,{db,role}]=await Promise.all([params,searchParams,requireStaff()]);
 if(id!=='new'&&!z.uuid().safeParse(id).success)notFound();
 const result=id==='new'?{data:null,error:null}:await db.from('cumilla_profiles').select('*').eq('id',id).maybeSingle();
 if(result.error)throw new Error('পরিচিতি আনা যায়নি। আবার চেষ্টা করুন।');
 const p=result.data as Profile|null;
 if(id!=='new'&&!p)notFound();
 const initialType=p?.profile_type??(search.type==='responsible'?'responsible':'candidate');
 const image=p?(await profilePhotos([p],db))[0]?.image??null:null;
 const status=p?.status??'draft',canPublish=role!=='editor';
 return <section className="profile-workspace">
  <div className="admin-page-header"><div><p className="eyebrow">{p?'পরিচিতি সম্পাদনা':'নতুন পরিচিতি'}</p><h1>{p?p.name:'নতুন প্রোফাইল'}</h1><p>মূল তথ্য দিন, ছবি নির্বাচন করুন, তারপর সংরক্ষণ বা প্রকাশ করুন।</p></div><div className="admin-page-actions"><Link className="admin-btn" href="/admin/profiles">← পরিচিতি তালিকা</Link>{p&&<Link className="admin-btn" href={'/admin/profiles/'+p.id+'/preview'}><Icon name="eye" size={17}/>প্রিভিউ</Link>}{p?.status==='published'&&<Link className="admin-btn" href={'/profiles/'+p.slug} target="_blank">লাইভ দেখুন ↗</Link>}</div></div>
  {search.saved&&<p className="profile-save-notice" role="status">{status==='published'?(p?.featured?'প্রকাশ হয়েছে। হোমপেজ ও পরিচিতি তালিকায় দেখা যাবে।':'প্রকাশ হয়েছে। পরিচিতি তালিকায় দেখা যাবে; হোমপেজে দেখানো বন্ধ আছে।'):status==='archived'?'আর্কাইভে রাখা হয়েছে।':'খসড়া সংরক্ষণ হয়েছে। হোমপেজে দেখাতে “প্রকাশ করুন” চাপুন।'}</p>}
  <ActionForm key={p?.updated_at??'new'} action={saveProfile} trackChanges uploadMode="profile" actions={<ProfileSubmit status={status} canPublish={canPublish}/>}>
   <input type="hidden" name="id" value={p?.id??''}/><input type="hidden" name="version" value={p?.updated_at??''}/>
   <div className="profile-publication"><div><span className={'admin-status '+status}>{status==='published'?'প্রকাশিত':status==='archived'?'আর্কাইভ':'খসড়া'}</span><p>{status==='published'?'আপনার পরিচিতি এখন সবার জন্য দেখা যাচ্ছে।':'এটি এখন শুধু অ্যাডমিন দেখতে পারেন। প্রকাশ করলে দর্শক দেখতে পাবেন।'}</p></div><label className="profile-featured"><input type="checkbox" name="featured" defaultChecked={p?.featured??true}/><span>হোমপেজে দেখান<small>প্রকাশের পরে ছবি ও পরিচিতির কার্ড দেখাবে</small></span></label></div>
   {!canPublish&&<p className="notice">খসড়া সংরক্ষণ করুন। Publisher বা Admin এটি প্রকাশ করবেন।</p>}
   <nav className="studio-editor-jumps" aria-label="পরিচিতির অংশ"><a href="#profile-basic">মূল তথ্য</a><a href="#profile-photo">ছবি</a><a href="#profile-bio">পরিচয়</a><a href="#profile-contact">যোগাযোগ</a></nav>
   <div className="profile-form-columns"><div>
    <section className="admin-form-section" id="profile-basic"><div className="admin-form-section-head"><div><h2>মূল পরিচিতি</h2><p>নাম আবশ্যক। বাকি তথ্য প্রয়োজনমতো দিন।</p></div><Icon name="users"/></div>
     <div className="admin-form-grid"><label>পরিচিতির ধরন<select name="profile_type" defaultValue={initialType}><option value="candidate">প্রার্থী পরিচিতি</option><option value="responsible">স্থানীয় দায়িত্বশীল</option></select></label><label>পূর্ণ নাম *<input name="name" required maxLength={180} defaultValue={p?.name??''} placeholder="পূর্ণ নাম লিখুন"/></label><label>পদবি / প্রার্থিতার পদ<input name="designation" maxLength={180} defaultValue={p?.designation??''} placeholder="যেমন: আমির / চেয়ারম্যান প্রার্থী"/></label><label>এলাকার নাম<input name="area_name" maxLength={180} defaultValue={p?.area_name??''} placeholder="দায়িত্ব বা নির্বাচনী এলাকা"/></label><label>উপজেলা<select name="upazila" defaultValue={p?.upazila??''}><option value="">নির্বাচন করুন</option><option value="daudkandi">দাউদকান্দি</option><option value="meghna">মেঘনা</option></select></label><label>ইউনিয়ন / পৌরসভা<input name="union_name" maxLength={180} defaultValue={p?.union_name??''}/></label><label>পেশা<input name="profession" maxLength={500} defaultValue={p?.profession??''}/></label></div>
    </section>
    <ProfilePhotoEditor image={image} external={p?.photo_url??null}/>
    <section className="admin-form-section" id="profile-bio"><div className="admin-form-section-head"><div><h2>বিস্তারিত পরিচয়</h2><p>জীবনী, অভিজ্ঞতা ও শিক্ষাগত যোগ্যতা।</p></div><Icon name="file"/></div><label>জীবনী ও জনসেবামূলক কাজ<textarea name="bio" rows={8} maxLength={30000} defaultValue={p?.bio??''}/></label><label>শিক্ষাগত যোগ্যতা<textarea name="education" rows={3} maxLength={3000} defaultValue={p?.education??''}/></label></section>
   </div><div>
    <section className="admin-form-section" id="profile-contact"><div className="admin-form-section-head"><div><h2>যোগাযোগ ও তথ্যসূত্র</h2><p>এখানে দেওয়া যোগাযোগের তথ্য প্রকাশিত প্রোফাইলে দেখা যাবে।</p></div></div><label>প্রকাশ্য ফোন নম্বর<input type="tel" name="phone" maxLength={80} defaultValue={p?.phone??''}/></label><label>প্রকাশ্য ইমেইল<input type="email" name="email" maxLength={180} defaultValue={p?.email??''}/></label><label>Facebook লিংক<input type="url" name="facebook_url" maxLength={2000} defaultValue={p?.facebook_url??''} placeholder="https://..."/></label><label>ওয়েবসাইট<input type="url" name="website_url" maxLength={2000} defaultValue={p?.website_url??''} placeholder="https://..."/></label><label>তথ্যসূত্র<input type="url" name="source_url" maxLength={2000} defaultValue={p?.source_url??''} placeholder="https://..."/></label></section>
    <section className="admin-form-section"><h2>সাজানোর ক্রম</h2><label>ক্রম<input type="number" name="sort_order" min={0} max={9999} defaultValue={p?.sort_order??0}/><span className="admin-help">ছোট সংখ্যা আগে দেখাবে। একই ক্রমে সর্বশেষ সম্পাদিতটি আগে।</span></label><details className="profile-link-settings"><summary>প্রোফাইল লিংক</summary><label>লিংকের শেষ অংশ<input name="slug" maxLength={140} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={p?.slug??''} placeholder="খালি রাখলে স্বয়ংক্রিয়ভাবে তৈরি হবে"/><span className="admin-help">ইংরেজি ছোট অক্ষর, সংখ্যা ও হাইফেন।</span></label></details>{p&&canPublish&&status!=='archived'&&<details className="profile-link-settings"><summary>পরিচিতি সরিয়ে রাখুন</summary><p className="admin-help">আর্কাইভ করলে ওয়েবসাইটে দেখা যাবে না। পরে আবার প্রকাশ করতে পারবেন।</p><ProfileArchive/></details>}</section>
   </div></div>
  </ActionForm>
 </section>;
}
