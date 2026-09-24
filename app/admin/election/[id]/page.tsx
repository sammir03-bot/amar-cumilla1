import Link from 'next/link';
import {notFound} from 'next/navigation';
import {requireStaff} from '../../../../lib/supabase';
import ElectionResultControlRoom from '../../../../components/election-result-control-room';
import {addCandidate,addCentre,bulkAddCentres,updateElectionMeta} from '../actions';

const statusNames:Record<string,string>={setup:'প্রস্তুতি',live:'লাইভ',completed:'সম্পন্ন',official:'অফিসিয়াল'};

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
  const controlCentres=centres.map((centre:any)=>({...centre,results:results.filter(result=>result.centre_id===centre.id).map(result=>({candidate_id:result.candidate_id,votes:result.votes}))}));
  const controlCandidates=candidates.filter((candidate:any)=>candidate.published!==false).map((candidate:any)=>({id:candidate.id,name:candidate.name,symbol:candidate.symbol??''}));

  return <section>
    <div className="admin-page-header">
      <div><p className="eyebrow">Live Result Control Room</p><h1>{election.union_name}</h1><p>{election.upazila==='daudkandi'?'দাউদকান্দি':'মেঘনা'} · {election.title}</p></div>
      <div className="admin-page-actions">{saved&&<span className="admin-saved">সংরক্ষণ হয়েছে</span>}<span className={'election-status '+election.status}>{statusNames[election.status]}</span><Link className="admin-btn" href="/admin/election">← সব নির্বাচন</Link>{election.published&&<Link className="admin-btn" href={`/election/${election.upazila}/${election.union_slug}`} target="_blank">Public page ↗</Link>}</div>
    </div>

    <div className="admin-panel election-control-panel">
      <div className="admin-panel-head"><div><h2>কেন্দ্রভিত্তিক লাইভ ফল ইনপুট</h2><small>ভোটের সংখ্যা লিখে “ফল এসেছে” বা “যাচাইকৃত” চাপলেই একই জায়গা থেকে দ্রুত সংরক্ষণ হবে। ভুল হলে বাংলা বার্তা দেখাবে।</small></div><strong>{centres.length.toLocaleString('bn-BD')} কেন্দ্র</strong></div>
      <ElectionResultControlRoom centres={controlCentres} candidates={controlCandidates} canEdit={canEdit}/>
    </div>

    <div className="admin-panel" style={{marginTop:18}}><div className="admin-panel-head"><h2>প্রার্থী</h2><small>{candidates.length.toLocaleString('bn-BD')} জন</small></div><div className="election-candidate-list">{candidates.map((c:any)=><div className="election-candidate-chip" key={c.id}>{c.photo_url&&<img src={c.photo_url} alt=""/>}<div><strong>{c.name}</strong><small>{c.symbol||'প্রতীক নেই'}</small></div></div>)}{!candidates.length&&<div className="admin-empty">এখনো কোনো প্রার্থী যোগ করা হয়নি।</div>}</div></div>

    {role==='admin'&&<div className="admin-panel election-meta-panel" style={{marginTop:18}}>
      <div className="admin-panel-head"><div><h2>ইউনিয়ন সেটিংস</h2><small>ভোটের দিন ফলাফল চালু/শেষ/অফিসিয়াল অবস্থায় পরিবর্তন করুন</small></div><span className={'election-status '+election.status}>{statusNames[election.status]}</span></div>
      <form action={updateElectionMeta} className="election-create-form">
        <input type="hidden" name="id" value={id}/>
        <div className="admin-form-grid"><label>ইউনিয়নের নাম<input name="union_name" required defaultValue={election.union_name}/></label><label>নির্বাচনের নাম<input name="title" required defaultValue={election.title}/></label></div>
        <div className="admin-form-grid"><label>অবস্থা<select name="status" defaultValue={election.status}>{Object.entries(statusNames).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label><label>সাজানোর ক্রম<input type="number" min="0" name="sort_order" defaultValue={election.sort_order}/></label></div>
        <label className="election-publish"><input type="checkbox" name="published" defaultChecked={election.published}/><span>এই ইউনিয়নের ফলাফল public page-এ দেখান</span></label>
        <button className="admin-btn primary" type="submit">ইউনিয়ন সেটিংস সংরক্ষণ</button>
      </form>
    </div>}

    {canEdit&&<div className="election-admin-grid" style={{marginTop:18}}>
      <div className="admin-panel"><div className="admin-panel-head"><div><h2>প্রার্থী যোগ করুন</h2><small>নির্বাচনের আগে সেটআপের জন্য</small></div></div><form action={addCandidate} className="election-create-form"><input type="hidden" name="election_id" value={id}/><label>প্রার্থীর নাম<input name="name" required/></label><div className="admin-form-grid"><label>প্রতীক<input name="symbol" placeholder="প্রতীকের নাম"/></label><label>ক্রম<input type="number" min="0" name="sort_order" defaultValue="0"/></label></div><label>ছবির URL<input name="photo_url" placeholder="/candidate.jpg অথবা https://..."/></label><label>সংক্ষিপ্ত পরিচিতি<textarea name="description" rows={3}/></label><button className="admin-btn primary" type="submit">＋ প্রার্থী যোগ করুন</button></form></div>
      <div className="admin-panel"><div className="admin-panel-head"><div><h2>ভোটকেন্দ্র যোগ করুন</h2><small>একটি কেন্দ্র আলাদা করে যোগ করুন</small></div></div><form action={addCentre} className="election-create-form"><input type="hidden" name="election_id" value={id}/><div className="admin-form-grid"><label>কেন্দ্র কোড<input name="centre_code" required placeholder="001"/></label><label>ক্রম<input type="number" min="0" name="sort_order" defaultValue="0"/></label></div><label>কেন্দ্রের নাম<input name="name" required placeholder="বিদ্যালয়/মাদ্রাসা/কেন্দ্রের নাম"/></label><label>মোট ভোটার<input type="number" min="0" name="total_voters" defaultValue="0"/></label><button className="admin-btn primary" type="submit">＋ কেন্দ্র যোগ করুন</button></form></div>
    </div>}

    {canEdit&&<div className="admin-panel" style={{marginTop:18}}>
      <div className="admin-panel-head"><div><h2>একসাথে ভোটকেন্দ্র ইমপোর্ট</h2><small>একবারে পুরো ইউনিয়নের কেন্দ্রের তালিকা যোগ বা আপডেট করুন</small></div></div>
      <form action={bulkAddCentres} className="election-create-form">
        <input type="hidden" name="election_id" value={id}/>
        <label>কেন্দ্রের তালিকা<textarea name="centres" rows={9} required placeholder={'001 | হাসানপুর সরকারি প্রাথমিক বিদ্যালয় | 2500\n002 | নুরপুর সরকারি প্রাথমিক বিদ্যালয় | 2100\n003 | অন্য কেন্দ্রের নাম | 0'}/></label>
        <small>প্রতি লাইনে: কেন্দ্র কোড | কেন্দ্রের নাম | মোট ভোটার। Tab দিয়েও আলাদা করা যাবে। শুধু নাম দিলে 001, 002… কোড নিজে তৈরি হবে। একই কোড আবার দিলে আগের কেন্দ্র আপডেট হবে।</small>
        <button className="admin-btn primary" type="submit">⇪ কেন্দ্রের তালিকা ইমপোর্ট করুন</button>
      </form>
    </div>}
  </section>;
}
