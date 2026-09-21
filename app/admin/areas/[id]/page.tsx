import Link from 'next/link';
import {notFound,redirect} from 'next/navigation';
import {requireStaff} from '../../../../lib/supabase';
import ActionForm from '../../../../components/action-form';
import {saveArea} from '../../actions';

export default async function AreaEditor({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{saved?:string}>}){
  const {db,role}=await requireStaff();
  if(role!=='admin')redirect('/admin');
  const {data:a,error}=await db.from('cumilla_areas').select('*').eq('id',(await params).id).maybeSingle();
  if(error)throw error;if(!a)notFound();
  const saved=(await searchParams).saved;

  return <section>
    <div className="admin-page-header">
      <div><p className="eyebrow">এলাকা সম্পাদনা</p><h1>{a.name}</h1><p>পরিচিতি, স্থানীয় তথ্য, ছবি, উৎস ও যাচাই এক জায়গা থেকে নিয়ন্ত্রণ করুন।</p></div>
      <div className="admin-page-actions">{saved&&<span className="admin-saved">সংরক্ষণ হয়েছে</span>}<Link className="admin-btn" href="/admin/areas">← সব এলাকা</Link>{a.published&&<Link className="admin-btn" href={`/areas/${a.upazila}/${a.slug}`} target="_blank">পাবলিক পেজ ↗</Link>}</div>
    </div>

    <ActionForm action={saveArea}>
      <input type="hidden" name="id" value={a.id}/><input type="hidden" name="version" value={a.updated_at}/>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>১. পরিচিতি</h2><p>এলাকার নাম ও সংক্ষিপ্ত, নির্ভরযোগ্য পরিচিতি লিখুন।</p></div></div>
        <label>এলাকার নাম<input name="name" required maxLength={180} defaultValue={a.name}/></label>
        <label>পরিচিতি<textarea name="description" rows={7} maxLength={20000} defaultValue={a.description} placeholder="এলাকার সংক্ষিপ্ত ও নির্ভরযোগ্য পরিচিতি…"/></label>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>২. স্থানীয় তথ্য</h2><p>যাচাই করা গ্রাম, শিক্ষা প্রতিষ্ঠান, গুরুত্বপূর্ণ স্থান ও জনসেবার তথ্য রাখুন।</p></div></div>
        <label>গ্রাম ও ওয়ার্ড<textarea name="villages" rows={7} maxLength={20000} defaultValue={a.villages}/></label>
        <label>শিক্ষাপ্রতিষ্ঠান ও গুরুত্বপূর্ণ স্থান<textarea name="institutions" rows={7} maxLength={20000} defaultValue={a.institutions}/></label>
        <label>জনসেবার তথ্য<textarea name="services" rows={7} maxLength={20000} defaultValue={a.services}/></label>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>৩. এলাকার ছবি</h2><p>নিজস্ব অথবা পুনঃব্যবহারের অনুমতি থাকা ছবি দিন। অন্যের কপিরাইটেড ছবি কপি করবেন না।</p></div></div>
        {a.image_url&&<div style={{marginBottom:16}}><img src={a.image_url} alt={`${a.name} এলাকার বর্তমান ছবি`} style={{width:'100%',maxHeight:320,objectFit:'cover',borderRadius:14}}/></div>}
        <label>ছবির সরাসরি URL<input type="url" name="image_url" defaultValue={a.image_url??''} placeholder="https://…"/><span className="admin-help">নিজস্ব ছবি বা Wikimedia Commons-এর মতো বৈধ উৎসের ছবি ব্যবহার করুন।</span></label>
        <label>ছবির উৎস পেজ<input type="url" name="image_source_url" defaultValue={a.image_source_url??''} placeholder="https://commons.wikimedia.org/…"/></label>
        <div className="admin-form-grid">
          <label>ফটো ক্রেডিট<input name="image_credit" maxLength={300} defaultValue={a.image_credit??''} placeholder="যেমন: CAPTAIN RAJU / Wikimedia Commons"/></label>
          <label>লাইসেন্স<input name="image_license" maxLength={120} defaultValue={a.image_license??''} placeholder="যেমন: CC BY-SA 4.0"/></label>
        </div>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>৪. উৎস ও যাচাই</h2><p>বিশ্বাসযোগ্য সরকারি বা প্রাথমিক উৎস ছাড়া কোনো এলাকা প্রকাশ করবেন না।</p></div></div>
        <label>মূল তথ্যসূত্রের লিংক<input type="url" name="source_url" defaultValue={a.source_url??''} placeholder="https://…"/><span className="admin-help">সম্ভব হলে ইউনিয়ন/পৌরসভার সরকারি পোর্টালের লিংক দিন।</span></label>
        <label className="check"><input type="checkbox" name="verified" defaultChecked={!!a.verified_at}/>আমি তথ্য ও উৎস যাচাই করেছি</label>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>৫. প্রকাশ</h2><p>পরিচিতি, উৎস ও যাচাই সম্পন্ন হলে তবেই প্রকাশ করুন।</p></div></div>
        <label className="check"><input type="checkbox" name="published" defaultChecked={a.published}/>মূল ওয়েবসাইটে এই এলাকা প্রকাশ করুন</label>
      </div>
    </ActionForm>
  </section>;
}
