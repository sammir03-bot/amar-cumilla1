import Link from 'next/link';
import {notFound} from 'next/navigation';
import {requireStaff} from '../../../../lib/supabase';
import {kinds,Post} from '../../../../lib/content';
import ActionForm from '../../../../components/action-form';
import MediaPicker from '../../../../components/media-picker';
import {savePost} from '../../actions';

export default async function Editor({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{saved?:string}>}){
  const {id}=await params;
  const {db,role}=await requireStaff();
  const [record,areas]=await Promise.all([
    id==='new'?Promise.resolve({data:null,error:null}):db.from('cumilla_posts').select('*').eq('id',id).maybeSingle(),
    db.from('cumilla_areas').select('upazila,slug,name').order('name')
  ]);
  if(record.error||areas.error)throw new Error('তথ্য আনা যায়নি');
  const p=record.data as Post|null;
  if(id!=='new'&&!p)notFound();
  const saved=(await searchParams).saved;

  return <section>
    <div className="admin-page-header">
      <div><p className="eyebrow">{p?'সম্পাদনা':'নতুন কনটেন্ট'}</p><h1>{p?p.title:'নতুন প্রকাশনা'}</h1><p>{p?'তথ্য পরিবর্তন করে সংরক্ষণ করুন। প্রকাশের আগে প্রিভিউ দেখে নিন।':'ধাপে ধাপে তথ্য দিন। প্রথমে খসড়া হিসেবে সংরক্ষণ করাই নিরাপদ।'}</p></div>
      <div className="admin-page-actions">{saved&&<span className="admin-saved">সংরক্ষণ হয়েছে</span>}<Link className="admin-btn" href="/admin/content">← তালিকা</Link>{p&&<Link className="admin-btn" href={'/admin/preview/'+p.id} target="_blank">প্রিভিউ ↗</Link>}</div>
    </div>

    <ActionForm action={savePost}>
      <input type="hidden" name="id" value={p?.id??''}/><input type="hidden" name="version" value={p?.updated_at??''}/>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>১. মূল তথ্য</h2><p>কনটেন্টের ধরন, শিরোনাম এবং ওয়েব ঠিকানা দিন।</p></div></div>
        <div className="admin-form-grid">
          <label>বিভাগ<select name="kind" defaultValue={p?.kind??'news'}>{Object.entries(kinds).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
          <label>অবস্থা<select name="status" defaultValue={p?.status??'draft'}><option value="draft">খসড়া</option><option value="review">পর্যালোচনার জন্য</option>{role!=='editor'&&<><option value="published">প্রকাশিত</option><option value="archived">আর্কাইভ</option></>}</select><span className="admin-help">নিশ্চিত না হলে “খসড়া” রাখুন।</span></label>
        </div>
        <label>শিরোনাম<input name="title" required maxLength={180} defaultValue={p?.title} placeholder="যেমন: দাউদকান্দিতে জনসভা অনুষ্ঠিত"/></label>
        <label>লিংকের নাম<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={140} defaultValue={p?.slug} placeholder="daudkandi-jonosobha"/><span className="admin-help">শুধু ইংরেজি ছোট অক্ষর, সংখ্যা ও হাইফেন ব্যবহার করুন।</span></label>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>২. মূল লেখা</h2><p>পাঠক যা দেখবেন সেটি সহজ ভাষায় লিখুন।</p></div></div>
        <label>বিস্তারিত<textarea name="body" required rows={16} maxLength={100000} defaultValue={p?.body} placeholder="এখানে বিস্তারিত লিখুন…"/></label>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>৩. এলাকা</h2><p>এই কনটেন্ট কোন কোন এলাকার সাথে সম্পর্কিত তা নির্বাচন করুন।</p></div></div>
        <fieldset><legend>সংশ্লিষ্ট এলাকা</legend><div className="admin-check-grid">{areas.data?.map(a=>{const key=a.upazila+'/'+a.slug;return <label key={key}><input type="checkbox" name="area_keys" value={key} defaultChecked={p?.area_keys?.includes(key)}/>{a.name}</label>;})}</div></fieldset>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>৪. কর্মসূচির তথ্য</h2><p>কেবল কর্মসূচির ক্ষেত্রে সময় ও স্থান দিন; অন্য কনটেন্টে ফাঁকা রাখুন।</p></div></div>
        <div className="admin-form-grid">
          <label>তারিখ ও সময়<input type="datetime-local" name="event_at" defaultValue={p?.event_at?new Date(new Date(p.event_at).valueOf()+21600000).toISOString().slice(0,16):''}/><span className="admin-help">বাংলাদেশ সময়</span></label>
          <label>স্থান<input name="venue" maxLength={500} defaultValue={p?.venue} placeholder="স্থান বা ঠিকানা"/></label>
        </div>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>৫. ছবি ও PDF</h2><p>আগে Media বিভাগে আলাদা করে আপলোড করতে হবে না। এখান থেকেই ছবি নির্বাচন করুন।</p></div><Link className="admin-btn" href="/admin/media" target="_blank">মিডিয়া লাইব্রেরি ↗</Link></div>
        <MediaPicker existing={p?.media_paths??[]}/>
      </div>
    </ActionForm>
  </section>;
}
