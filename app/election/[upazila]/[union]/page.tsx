import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getElectionDetail,getElectionSettings} from '../../../../lib/election';
import ElectionLiveRefresh from '../../../../components/election-live-refresh';
import styles from '../../election.module.css';

export const dynamic='force-dynamic';
const upazilaName=(v:string)=>v==='daudkandi'?'দাউদকান্দি':'মেঘনা';
const centreStatus:Record<string,string>={pending:'অপেক্ষমাণ',reported:'ফল পাওয়া গেছে',verified:'যাচাইকৃত',official:'অফিসিয়াল'};

export default async function UnionElection({params}:{params:Promise<{upazila:string;union:string}>}){
  const {upazila,union}=await params;
  const [settings,data]=await Promise.all([getElectionSettings(),getElectionDetail(upazila,union)]);
  if(!data)notFound();
  const live=!!settings?.live_mode;
  const pct=data.centres.length?Math.round(data.centresReported/data.centres.length*100):0;
  return <div className={styles.page}>
    {live&&<ElectionLiveRefresh seconds={15}/>} 
    <section className={styles.hero}><div className={styles.heroInner}>
      <span className={styles.live}><i/>{live?'LIVE RESULT':'RESULT PAGE'}</span>
      <h1>{data.election.union_name}</h1>
      <p>{upazilaName(data.election.upazila)} উপজেলা · {data.election.title}</p>
      <div className={styles.meta}><span>{data.centresReported}/{data.centres.length} কেন্দ্র</span><span>{pct}% রিপোর্টিং</span><span>{data.election.status==='official'?'অফিসিয়াল':'সংগৃহীত ফলাফল'}</span></div>
    </div></section>
    <div className={styles.notice}>{settings?.note}</div>
    <section className={styles.content}>
      <Link href="/election" className={styles.back}>← সব ইউনিয়নের ফলাফল</Link>
      {data.candidates.length?<div className={styles.candidateGrid}>{data.candidates.map((candidate,index)=><article className={styles.candidate} key={candidate.id}>
        {candidate.photo_url&&<img src={candidate.photo_url} alt={`${candidate.name} এর ছবি`}/>}<small>{index===0&&data.centresReported?'বর্তমানে এগিয়ে':'প্রার্থী'}</small><h3>{candidate.name}</h3><span>{candidate.symbol||'প্রতীক পরে যোগ করা হবে'}</span><b>{candidate.votes.toLocaleString('bn-BD')}</b><span>ভোট</span>
      </article>)}</div>:<div className={styles.empty}>এখনো কোনো প্রার্থী যোগ করা হয়নি।</div>}

      <div className={styles.centreList}>{data.centres.map(centre=><article className={`${styles.centre} ${centre.status==='pending'?styles.pending:''}`} key={centre.id}>
        <div className={styles.centreTop}><div><h3>{centre.centre_code} · {centre.name}</h3><p>{centre.total_voters?`মোট ভোটার ${centre.total_voters.toLocaleString('bn-BD')}`:'মোট ভোটার পরে যোগ করা যাবে'} · {centreStatus[centre.status]}</p></div><strong>{centre.status==='pending'?'—':'ফল'}</strong></div>
        {centre.status!=='pending'&&centre.results.map(result=><div className={styles.resultRow} key={result.candidate_id}><span>{result.name}{result.symbol?` · ${result.symbol}`:''}</span><b>{result.votes.toLocaleString('bn-BD')}</b></div>)}
        {centre.status!=='pending'&&centre.invalid_votes>0&&<div className={styles.resultRow}><span>বাতিল ভোট</span><b>{centre.invalid_votes.toLocaleString('bn-BD')}</b></div>}
      </article>)}</div>
      {!data.centres.length&&<div className={styles.empty}>এখনো কোনো ভোটকেন্দ্র যোগ করা হয়নি। Admin Panel থেকে পরে যোগ করা যাবে।</div>}
    </section>
  </div>;
}
