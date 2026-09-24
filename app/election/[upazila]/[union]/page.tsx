import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getElectionDetail,getElectionSettings} from '../../../../lib/election';
import ElectionLiveRefresh from '../../../../components/election-live-refresh';
import ElectionCentreBrowser from '../../../../components/election-centre-browser';
import styles from '../../election.module.css';

export const dynamic='force-dynamic';
const upazilaName=(v:string)=>v==='daudkandi'?'দাউদকান্দি':'মেঘনা';
const formatTime=(value:string|null)=>value?new Date(value).toLocaleString('bn-BD',{timeZone:'Asia/Dhaka',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}):'ফল আসেনি';

export default async function UnionElection({params}:{params:Promise<{upazila:string;union:string}>}){
  const {upazila,union}=await params;
  const settings=await getElectionSettings();
  if(settings&&!settings.public_enabled)notFound();
  const data=await getElectionDetail(upazila,union);
  if(!data)notFound();
  const live=!!settings?.live_mode;
  const pct=data.centres.length?Math.round(data.centresReported/data.centres.length*100):0;
  const hasResults=data.centresReported>0;
  const winnerLabel=data.election.status==='official'?'অফিসিয়াল ফল':'বর্তমান অবস্থান';
  return <div className={styles.page}>
    {live&&<ElectionLiveRefresh seconds={15}/>} 
    <section className={styles.hero}><div className={styles.heroInner}>
      <span className={styles.live}><i/>{live?'LIVE RESULT':'RESULT PAGE'}</span>
      <h1>{data.election.union_name}</h1>
      <p>{upazilaName(data.election.upazila)} উপজেলা · {data.election.title}</p>
      <div className={styles.meta}><span>{data.centresReported}/{data.centres.length} কেন্দ্র</span><span>{pct}% রিপোর্টিং</span><span>{data.election.status==='official'?'অফিসিয়াল':'সংগৃহীত ফলাফল'}</span><span>সর্বশেষ {formatTime(data.lastUpdated)}</span></div>
    </div></section>
    <div className={styles.notice}>{settings?.note??'সংগৃহীত লাইভ ফলাফল; সংশ্লিষ্ট রিটার্নিং অফিসার বা নির্বাচন কমিশনের আনুষ্ঠানিক ঘোষণাই চূড়ান্ত।'}</div>
    <section className={styles.content}>
      <Link href="/election" className={styles.back}>← সব ইউনিয়নের ফলাফল</Link>

      <div className={styles.summaryGrid}>
        <article><small>কেন্দ্র রিপোর্টিং</small><strong>{data.centresReported.toLocaleString('bn-BD')} / {data.centres.length.toLocaleString('bn-BD')}</strong><span>{pct.toLocaleString('bn-BD')}% সম্পন্ন</span></article>
        <article><small>গণনা করা ভোট</small><strong>{data.ballots.toLocaleString('bn-BD')}</strong><span>বৈধ {data.validVotes.toLocaleString('bn-BD')} · বাতিল {data.invalidVotes.toLocaleString('bn-BD')}</span></article>
        <article><small>রিপোর্টেড কেন্দ্রের ভোটার</small><strong>{data.registeredReported.toLocaleString('bn-BD')}</strong><span>{data.turnoutPct===null?'ভোটার সংখ্যা সম্পূর্ণ নয়':`উপস্থিতি আনুমানিক ${data.turnoutPct.toLocaleString('bn-BD')}%`}</span></article>
        <article><small>{winnerLabel}</small><strong>{!hasResults?'ফল আসেনি':data.tied?'সমান ভোট':data.candidates[0]?.name??'—'}</strong><span>{hasResults&&!data.tied&&data.candidates.length>1?`ব্যবধান ${data.leadMargin.toLocaleString('bn-BD')} ভোট`:data.tied?'শীর্ষ প্রার্থীরা সমান ভোটে':'সর্বশেষ আপডেট অনুযায়ী'}</span></article>
      </div>

      {data.candidates.length?<div className={styles.candidateGrid}>{data.candidates.map((candidate,index)=>{
        const isLeader=hasResults&&!data.tied&&index===0;
        const isTiedLeader=hasResults&&data.tied&&candidate.votes===data.candidates[0]?.votes;
        return <article className={`${styles.candidate} ${(isLeader||isTiedLeader)?styles.candidateLeader:''}`} key={candidate.id}>
          {candidate.photo_url&&<img src={candidate.photo_url} alt={`${candidate.name} এর ছবি`}/>}<small>{isLeader?(data.election.status==='official'?'সর্বোচ্চ ভোট':'বর্তমানে এগিয়ে'):isTiedLeader?'সমানভাবে এগিয়ে':'প্রার্থী'}</small><h3>{candidate.name}</h3><span>{candidate.symbol||'প্রতীক পরে যোগ করা হবে'}</span><b>{candidate.votes.toLocaleString('bn-BD')}</b><span>ভোট</span>
        </article>;
      })}</div>:<div className={styles.empty}>এখনো কোনো প্রার্থী যোগ করা হয়নি।</div>}

      <ElectionCentreBrowser centres={data.centres}/>
    </section>
  </div>;
}
