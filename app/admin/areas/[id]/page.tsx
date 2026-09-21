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
      <div><p className="eyebrow">এলাকা সম্পাদনা</p><h1>{a.name}</h1><p>প্রকাশের আগে পরিচিতি, উৎস এবং যাচাইয়ের অবস্থা নিশ্চিত করুন।</p></div>
      <div className="admin-page-actions">{saved&&<span className="admin-saved">সংরক্ষণ হয়েছে</span>}<Link className="admin-btn" href="/admin/areas">← সব এলাকা</Link></div>
    </div>

    <ActionForm action={saveArea}>
      <input type="hidden" name="id" value={a.id}/><input type="hidden" name="version" value={a.updated_at}/>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>১. পরিচিতি</h2><p>এলাকার নাম ও সাধারণ পরিচিতি লিখুন।</p></div></div>
        <label>এলাকার নাম<input name="name" required maxLength={180} defaultValue={a.name}/></label>
        <label>পরিচিতি<textarea name="description" rows={7} maxLength={20000} defaultValue={a.description} placeholder="এলাকার সংক্ষিপ্ত ও নির্ভরযোগ্য পরিচিতি…"/></label>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>২. স্থানীয় তথ্য</h2><p>প্রয়োজনমতো গ্রাম, প্রতিষ্ঠান ও জনসেবার তথ্য যোগ করুন।</p></div></div>
        <label>গ্রাম ও ওয়ার্ড<textarea name="villages" rows={6} maxLength={20000} defaultValue={a.villages}/></label>
        <label>শিক্ষাপ্রতিষ্ঠান ও গুরুত্বপূর্ণ স্থান<textarea name="institutions" rows={6} maxLength={20000} defaultValue={a.institutions}/></label>
        <label>জনসেবার তথ্য<textarea name="services" rows={6} maxLength={20000} defaultValue={a.services}/></label>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>৩. উৎস ও যাচাই</h2><p>বিশ্বাসযোগ্য উৎস ছাড়া কোনো এলাকা প্রকাশ করবেন না।</p></div></div>
        <label>তথ্যসূত্রের লিংক<input type="url" name="source_url" defaultValue={a.source_url??''} placeholder="https://…"/><span className="admin-help">সম্পূর্ণ https:// লিংক দিন।</span></label>
        <label className="check"><input type="checkbox" name="verified" defaultChecked={!!a.verified_at}/>আমি তথ্য ও উৎস যাচাই করেছি</label>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>৪. প্রকাশ</h2><p>পরিচিতি, উৎস ও যাচাই সম্পন্ন হলে তবেই প্রকাশ করুন।</p></div></div>
        <label className="check"><input type="checkbox" name="published" defaultChecked={a.published}/>মূল ওয়েবসাইটে এই এলাকা প্রকাশ করুন</label>
      </div>
    </ActionForm>
  </section>;
}
