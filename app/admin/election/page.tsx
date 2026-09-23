import Link from 'next/link';
import {requireStaff} from '../../../lib/supabase';
import {createElection,updateElectionSettings} from './actions';

const statusNames:Record<string,string>={setup:'প্রস্তুতি',live:'লাইভ',completed:'সম্পন্ন',official:'অফিসিয়াল'};

export default async function ElectionAdmin({searchParams}:{searchParams:Promise<{saved?:string}>}){
  const {db,role}=await requireStaff();
  const [settingsRes,electionsRes]=await Promise.all([
    db.from('cumilla_election_settings').select('*').eq('id',1).maybeSingle(),
    db.from('cumilla_elections').select('*').order('sort_order').order('union_name'),
  ]);
  if(settingsRes.error||electionsRes.error)throw new Error('নির্বাচন কন্ট্রোল রুম খোলা যায়নি');
  const settings=settingsRes.data;
  const saved=(await searchParams).saved;

  return <section>
    <div className="admin-page-header">
      <div><p className="eyebrow">নির্বাচন</p><h1>Live Result Control Room</h1><p>ইউনিয়ন, প্রার্থী, ভোটকেন্দ্র ও ফল আগে থেকে প্রস্তুত রাখুন। ভোটের দিন Live Mode চালু করলে ফলাফল সাইটের সবার উপরে উঠে আসবে।</p></div>
      <div className="admin-page-actions">{saved&&<span className="admin-saved">সংরক্ষণ হয়েছে</span>}<Link className="admin-btn" href="/election" target="_blank">Public result ↗</Link></div>
    </div>

    <div className="election-admin-grid">
      <div className="admin-panel election-control-panel">
        <div className="admin-panel-head"><h2>Election Day Mode</h2><span className={'election-mode '+(settings?.live_mode?'on':'off')}>{settings?.live_mode?'LIVE ON':'OFF'}</span></div>
        {role==='admin'?<form action={updateElectionSettings} className="election-settings-form">
          <label className="election-toggle"><input type="checkbox" name="live_mode" defaultChecked={settings?.live_mode}/><span/><b>Live Mode</b><small>চালু হলে পুরো সাইটে LIVE banner এবং homepage-এর একদম উপরে ফলাফল দেখাবে।</small></label>
          <label className="election-toggle"><input type="checkbox" name="public_enabled" defaultChecked={settings?.public_enabled}/><span/><b>Public Result Page</b><small>/election পেজ সাধারণ দর্শকের জন্য প্রস্তুত থাকবে।</small></label>
          <div className="admin-form-grid"><label>নির্বাচনের দিন<input type="date" name="election_day" defaultValue={settings?.election_day??''}/></label><label>শিরোনাম<input name="headline" maxLength={180} defaultValue={settings?.headline??'লাইভ ইউনিয়ন নির্বাচন ফলাফল'}/></label></div>
          <label>ফলাফলের সতর্কীকরণ<textarea name="note" rows={3} maxLength={1000} defaultValue={settings?.note??''}/></label>
          <button className="admin-btn primary" type="submit">সেটিংস সংরক্ষণ</button>
        </form>:<div className="admin-empty">Live Mode পরিবর্তনের জন্য Admin role প্রয়োজন।</div>}
      </div>

      {role==='admin'&&<div className="admin-panel">
        <div className="admin-panel-head"><h2>নতুন ইউনিয়ন নির্বাচন</h2></div>
        <form action={createElection} className="election-create-form">
          <div className="admin-form-grid"><label>উপজেলা<select name="upazila" defaultValue="daudkandi"><option value="daudkandi">দাউদকান্দি</option><option value="meghna">মেঘনা</option></select></label><label>ইউনিয়নের নাম<input name="union_name" required placeholder="যেমন: গৌরীপুর ইউনিয়ন"/></label></div>
          <div className="admin-form-grid"><label>Slug<input name="union_slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="gouripur"/></label><label>নির্বাচনের নাম<input name="title" required defaultValue="ইউনিয়ন পরিষদ নির্বাচন"/></label></div>
          <button className="admin-btn primary" type="submit">＋ ইউনিয়ন যোগ করুন</button>
        </form>
      </div>}
    </div>

    <div className="admin-panel" style={{marginTop:18}}>
      <div className="admin-panel-head"><h2>ইউনিয়নভিত্তিক নির্বাচন</h2><small>{(electionsRes.data?.length??0).toLocaleString('bn-BD')}টি সেটআপ</small></div>
      <div className="election-admin-list">{electionsRes.data?.map((e:any)=><Link href={'/admin/election/'+e.id} className="election-admin-row" key={e.id}>
        <div><small>{e.upazila==='daudkandi'?'দাউদকান্দি':'মেঘনা'}</small><strong>{e.union_name}</strong><span>{e.title}</span></div>
        <div><span className={'election-status '+e.status}>{statusNames[e.status]??e.status}</span><b>{e.published?'Public':'Hidden'} →</b></div>
      </Link>)}{!electionsRes.data?.length&&<div className="admin-empty">এখনো কোনো ইউনিয়ন নির্বাচন যোগ করা হয়নি। আগে ইউনিয়ন তৈরি করুন।</div>}</div>
    </div>
  </section>;
}
