import Link from 'next/link';
import {notFound} from 'next/navigation';
import {requireStaff} from '../../../../lib/supabase';
import {addCandidate,addCentre,saveCentreResult,updateElectionMeta} from '../actions';

const statusNames:Record<string,string>={setup:'প্রস্তুতি',live:'লাইভ',completed:'সম্পন্ন',official:'অফিসিয়াল'};
const centreStatus:Record<string,string>={pending:'অপেক্ষমাণ',reported:'ফল পাওয়া গেছে',verified:'যাচাইকৃত',official:'অফিসিয়াল'};

export default async function ElectionEditor({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{saved?:string}>}){
  const {id}=await params;const saved=(await searchParams).saved;
  const {db,role}=await requireStaff();
  const [electionRes,candidateRes,centreRes]=await Promise.all([
    db.from('cumilla_elections').select('*').eq('id',id).maybeSingle(),
    db.from('cumilla_election_candidates').select('*').eq('election_id',id).order('sort_order').order('created_at'),
    db.from('cumilla_election_centres').select('*').eq('election_id',id).order('sort_order').order('centre_code'),
  ]);
  if(electionRes.error||candidateRes.error||centreRes.error)throw new Error('নির্বাচনের তথ্য আনা যায়নি');
  if(!electionRes.data)notFound();
  const election=electionRes.data;
  const centres=centreRes.data??[];const candidates=candidateRes.data??[];
  let results:any[]=[];
  if(centres.length){const r=await db.from('cumilla_election_results').select('*').in('centre_id',centres.map((c:any)=>c.id));if(r.error)throw r.error;results=r.data??[];}
  const canEdit=role==='admin'||role==='publisher';

  return <section>
    <div className="admin-page-header">
      <div><p className="eyebrow">Live Result Control Room</p><h1>{election.union_name}</h1><p>{election.upazila==='daudkandi'?'দাউদকান্দি':'মেঘনা'} · {election.title}</p></div>
      <div className="admin-page-actions">{saved&&<span className="admin-saved">সংরক্ষণ হয়েছে</span>}<Link className="admin-btn" href="/admin/election">← সব নির্বাচন</Link>{election.published&&<Link className="admin-btn" href={`/election/${election.upazila}/${election.union_slug}`} target="_blank">Public page ↗</Link>}</div>
    </div>

    {role==='admin'&&<div className="admin-panel election-meta-panel">
      <div className="admin-panel-head"><h2>ইউনিয়ন সেটিংস</h2><span className={'election-status '+election.status}>{statusNames[election.status]}</span></div>
      <form action={updateElectionMeta} className="election-create-form">
        <input type="hidden" name="id" value={id}/>
        <div className="admin-form-grid"><label>ইউনিয়নের নাম<input name="union_name" required defaultValue={election.union_name}/></label><label>নির্বাচনের নাম<input name="title" required defaultValue={election.title}/></label></div>
        <div className="admin-form-grid"><label>অবস্থা<select name="status" defaultValue={election.status}>{Object.entries(statusNames).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label><label>সাজানোর ক্রম<input type="number" min="0" name="sort_order" defaultValue={election.sort_order}/></label></div>
        <label className="election-publish"><input type="checkbox" name="published" defaultChecked={election.published}/><span>এই ইউনিয়নের ফলাফল public page-এ দেখান</span></label>
        <button className="admin-btn primary" type="submit">ইউনিয়ন সেটিংস সংরক্ষণ</button>
      </form>
    </div>}

    {canEdit&&<div className="election-admin-grid" style={{marginTop:18}}>
      <div className="admin-panel"><div className="admin-panel-head"><h2>প্রার্থী যোগ করুন</h2></div><form action={addCandidate} className="election-create-form"><input type="hidden" name="election_id" value={id}/><label>প্রার্থীর নাম<input name="name" required/></label><div className="admin-form-grid"><label>প্রতীক<input name="symbol" placeholder="প্রতীকের নাম"/></label><label>ক্রম<input type="number" min="0" name="sort_order" defaultValue="0"/></label></div><label>ছবির URL<input name="photo_url" placeholder="/candidate.jpg অথবা https://..."/></label><label>সংক্ষিপ্ত পরিচিতি<textarea name="description" rows={3}/></label><button className="admin-btn primary" type="submit">＋ প্রার্থী যোগ করুন</button></form></div>
      <div className="admin-panel"><div className="admin-panel-head"><h2>ভোটকেন্দ্র যোগ করুন</h2></div><form action={addCentre} className="election-create-form"><input type="hidden" name="election_id" value={id}/><div className="admin-form-grid"><label>কেন্দ্র কোড<input name="centre_code" required placeholder="001"/></label><label>ক্রম<input type="number" min="0" name="sort_order" defaultValue="0"/></label></div><label>কেন্দ্রের নাম<input name="name" required placeholder="বিদ্যালয়/মাদ্রাসা/কেন্দ্রের নাম"/></label><label>মোট ভোটার<input type="number" min="0" name="total_voters" defaultValue="0"/></label><button className="admin-btn primary" type="submit">＋ কেন্দ্র যোগ করুন</button></form></div>
    </div>}

    <div className="admin-panel" style={{marginTop:18}}><div className="admin-panel-head"><h2>প্রার্থী</h2><small>{candidates.length.toLocaleString('bn-BD')} জন</small></div><div className="election-candidate-list">{candidates.map((c:any)=><div className="election-candidate-chip" key={c.id}>{c.photo_url&&<img src={c.photo_url} alt=""/>}<div><strong>{c.name}</strong><small>{c.symbol||'প্রতীক নেই'}</small></div></div>)}{!candidates.length&&<div className="admin-empty">এখনো কোনো প্রার্থী যোগ করা হয়নি।</div>}</div></div>

    <div className="admin-panel" style={{marginTop:18}}><div className="admin-panel-head"><h2>কেন্দ্রভিত্তিক ফল ইনপুট</h2><small>{centres.length.toLocaleString('bn-BD')} কেন্দ্র</small></div><div className="election-centre-editor-list">{centres.map((centre:any)=>{
      const centreResults=results.filter(r=>r.centre_id===centre.id);
      return <form action={saveCentreResult} className="election-centre-editor" key={centre.id}><input type="hidden" name="centre_id" value={centre.id}/><div className="election-centre-title"><div><strong>{centre.centre_code} · {centre.name}</strong><small>মোট ভোটার: {centre.total_voters.toLocaleString('bn-BD')}</small></div><span className={'submission-status '+(centre.status==='pending'?'new':centre.status==='reported'?'reviewing':'resolved')}>{centreStatus[centre.status]}</span></div>
        <div className="election-vote-grid">{candidates.map((candidate:any)=>{const existing=centreResults.find(r=>r.candidate_id===candidate.id);return <label key={candidate.id}>{candidate.name}<small>{candidate.symbol}</small><input type="number" min="0" name={'votes_'+candidate.id} defaultValue={existing?.votes??0}/></label>})}</div>
        <div className="admin-form-grid"><label>বাতিল ভোট<input type="number" min="0" name="invalid_votes" defaultValue={centre.invalid_votes}/></label><label>স্ট্যাটাস<select name="status" defaultValue={centre.status}>{Object.entries(centreStatus).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label></div>
        {canEdit&&<button className="admin-btn primary" type="submit">ফল সংরক্ষণ</button>}
      </form>})}{!centres.length&&<div className="admin-empty">কেন্দ্র যোগ করলে এখানে ফল ইনপুট ফর্ম দেখা যাবে।</div>}</div></div>
  </section>;
}
