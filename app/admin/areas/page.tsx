import Link from 'next/link';
import {redirect} from 'next/navigation';
import {requireStaff} from '../../../lib/supabase';
import {upazilaNames} from '../../../lib/areas';

export default async function Areas(){
  const {db,role}=await requireStaff();
  if(role!=='admin')redirect('/admin');
  const {data,error}=await db.from('cumilla_areas').select('*').order('upazila').order('name');
  if(error)throw error;
  const groups=['daudkandi','meghna'];
  const published=data?.filter(a=>a.published).length??0;
  const verified=data?.filter(a=>a.verified_at).length??0;

  return <section>
    <div className="admin-page-header">
      <div><p className="eyebrow">এলাকা ব্যবস্থাপনা</p><h1>এলাকার তথ্য</h1><p>প্রতিটি এলাকার পরিচিতি, উৎস, যাচাই ও প্রকাশের অবস্থা এক জায়গা থেকে নিয়ন্ত্রণ করুন।</p></div>
    </div>

    <div className="admin-stats">
      <div className="admin-stat accent"><span>মোট রেকর্ড</span><strong>{(data?.length??0).toLocaleString('bn-BD')}</strong><small>সব এলাকা</small></div>
      <div className="admin-stat"><span>যাচাইকৃত</span><strong>{verified.toLocaleString('bn-BD')}</strong><small>উৎস পরীক্ষা করা হয়েছে</small></div>
      <div className="admin-stat"><span>প্রকাশিত</span><strong>{published.toLocaleString('bn-BD')}</strong><small>ওয়েবসাইটে দৃশ্যমান</small></div>
      <div className="admin-stat"><span>কাজ বাকি</span><strong>{((data?.length??0)-published).toLocaleString('bn-BD')}</strong><small>এখনো প্রকাশিত নয়</small></div>
    </div>

    <div className="admin-area-groups">
      {groups.map(group=>{const items=data?.filter(a=>a.upazila===group)??[];return <div className="admin-area-group" key={group}>
        <div className="admin-area-group-head"><h2>{upazilaNames[group]??group}</h2><span>{items.length.toLocaleString('bn-BD')}টি রেকর্ড</span></div>
        <div className="admin-area-list">{items.map(a=><Link className="admin-area-item" key={a.id} href={'/admin/areas/'+a.id}>
          <div><strong>{a.name}</strong><div className="admin-area-meta"><span className={'admin-status '+(a.published?'published':'draft')}>{a.published?'প্রকাশিত':'খসড়া'}</span><small>{a.verified_at?'যাচাইকৃত':'যাচাই বাকি'}</small></div></div><span className="admin-row-arrow">→</span>
        </Link>)}</div>
      </div>;})}
    </div>
  </section>;
}
