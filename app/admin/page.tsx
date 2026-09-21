import Link from 'next/link';
import {requireStaff} from '../../lib/supabase';
import {kinds} from '../../lib/content';

const statusNames:Record<string,string>={draft:'খসড়া',review:'পর্যালোচনা',published:'প্রকাশিত',archived:'আর্কাইভ'};

export default async function Admin(){
  const {db,role}=await requireStaff();
  const [total,published,draftReview,areas,recent]=await Promise.all([
    db.from('cumilla_posts').select('id',{count:'exact',head:true}),
    db.from('cumilla_posts').select('id',{count:'exact',head:true}).eq('status','published'),
    db.from('cumilla_posts').select('id',{count:'exact',head:true}).in('status',['draft','review']),
    db.from('cumilla_areas').select('id',{count:'exact',head:true}),
    db.from('cumilla_posts').select('id,title,kind,status,updated_at').order('updated_at',{ascending:false}).limit(6),
  ]);
  if(total.error||published.error||draftReview.error||areas.error||recent.error)throw new Error('Dashboard unavailable');

  return <section>
    <div className="admin-page-header">
      <div><p className="eyebrow">ড্যাশবোর্ড</p><h1>সবকিছু এক জায়গায়</h1><p>প্রকাশনা, এলাকা, মিডিয়া ও পরিবর্তনের অবস্থা দ্রুত দেখুন এবং প্রয়োজনীয় কাজ এক ক্লিকেই শুরু করুন।</p></div>
      <div className="admin-page-actions"><Link className="admin-btn" href="/" target="_blank">সাইট দেখুন ↗</Link><Link className="admin-btn primary" href="/admin/content/new">＋ নতুন প্রকাশনা</Link></div>
    </div>

    <div className="admin-stats">
      <div className="admin-stat accent"><span>মোট প্রকাশনা</span><strong>{(total.count??0).toLocaleString('bn-BD')}</strong><small>সব ধরনের কনটেন্ট</small></div>
      <div className="admin-stat"><span>প্রকাশিত</span><strong>{(published.count??0).toLocaleString('bn-BD')}</strong><small>ওয়েবসাইটে দৃশ্যমান</small></div>
      <div className="admin-stat"><span>কাজ বাকি</span><strong>{(draftReview.count??0).toLocaleString('bn-BD')}</strong><small>খসড়া ও পর্যালোচনা</small></div>
      <div className="admin-stat"><span>এলাকার রেকর্ড</span><strong>{(areas.count??0).toLocaleString('bn-BD')}</strong><small>দাউদকান্দি ও মেঘনা</small></div>
    </div>

    <div className="admin-dashboard-grid">
      <div className="admin-panel">
        <div className="admin-panel-head"><h2>সাম্প্রতিক প্রকাশনা</h2><Link href="/admin/content">সব দেখুন →</Link></div>
        {recent.data?.length?<div className="admin-recent-list">{recent.data.map(p=><Link className="admin-recent-item" href={'/admin/content/'+p.id} key={p.id}><div className="admin-recent-copy"><strong>{p.title}</strong><small>{kinds[p.kind]??p.kind} · {statusNames[p.status]??p.status} · {new Date(p.updated_at).toLocaleDateString('bn-BD',{timeZone:'Asia/Dhaka'})}</small></div><span className="admin-recent-arrow">→</span></Link>)}</div>:<div className="admin-empty">এখনো কোনো প্রকাশনা নেই। নতুন প্রকাশনা তৈরি করুন।</div>}
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head"><h2>দ্রুত কাজ</h2></div>
        <div className="admin-quick-grid">
          <Link className="admin-quick" href="/admin/content/new"><span className="admin-quick-icon">＋</span><span><strong>লেখা তৈরি</strong><small>সংবাদ, কর্মসূচি বা পাতা</small></span></Link>
          <Link className="admin-quick" href="/admin/media"><span className="admin-quick-icon">▧</span><span><strong>ফাইল আপলোড</strong><small>ছবি অথবা PDF</small></span></Link>
          <Link className="admin-quick" href="/admin/content"><span className="admin-quick-icon">▤</span><span><strong>খসড়া দেখুন</strong><small>সম্পাদনা ও প্রকাশ</small></span></Link>
          {role==='admin'?<Link className="admin-quick" href="/admin/areas"><span className="admin-quick-icon">⌖</span><span><strong>এলাকা সম্পাদনা</strong><small>উৎস যাচাই ও প্রকাশ</small></span></Link>:<Link className="admin-quick" href="/"><span className="admin-quick-icon">↗</span><span><strong>সাইট দেখুন</strong><small>লাইভ ওয়েবসাইট খুলুন</small></span></Link>}
        </div>
      </div>
    </div>
  </section>;
}
