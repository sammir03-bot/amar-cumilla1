import {redirect} from 'next/navigation';
import {requireStaff} from '../../../lib/supabase';

const entityNames:Record<string,string>={post:'প্রকাশনা',area:'এলাকা',media:'মিডিয়া'};
const actionNames:Record<string,string>={insert:'তৈরি',update:'পরিবর্তন',delete:'মুছে ফেলা'};

export default async function Audit(){
  const {db,role}=await requireStaff();
  if(role!=='admin')redirect('/admin');
  const {data,error}=await db.from('cumilla_audit').select('*').order('happened_at',{ascending:false}).limit(100);
  if(error)throw error;

  return <section>
    <div className="admin-page-header">
      <div><p className="eyebrow">নিরাপত্তা ও ইতিহাস</p><h1>পরিবর্তনের ইতিহাস</h1><p>সর্বশেষ ১০০টি সংরক্ষণ বা পরিবর্তনের রেকর্ড এখানে দেখা যায়।</p></div>
    </div>

    <div className="admin-audit-list">
      {data?.map(a=><article className="admin-audit-item" key={a.id}>
        <span className="admin-audit-icon">↺</span>
        <div className="admin-audit-copy"><strong>{entityNames[a.entity]??a.entity} · {actionNames[a.action]??a.action}</strong><small>রেকর্ড: {a.record_id} · সম্পাদক: {a.actor_id}</small></div>
        <time className="admin-audit-time">{new Date(a.happened_at).toLocaleString('bn-BD',{timeZone:'Asia/Dhaka'})}</time>
      </article>)}
      {!data?.length&&<div className="admin-empty">এখনো কোনো পরিবর্তনের রেকর্ড নেই।</div>}
    </div>
  </section>;
}
