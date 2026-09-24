import Link from 'next/link';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getElectionOverview,getElectionSettings} from '../../lib/election';
import ElectionLiveRefresh from '../../components/election-live-refresh';
import styles from './election.module.css';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'ইউনিয়ন নির্বাচন ফলাফল',description:'দাউদকান্দি ও মেঘনার ইউনিয়নভিত্তিক লাইভ ও যাচাইকৃত নির্বাচন ফলাফল।'};

const upazilaName=(v:string)=>v==='daudkandi'?'দাউদকান্দি':'মেঘনা';
const statusName:Record<string,string>={setup:'প্রস্তুতি',live:'LIVE',completed:'সম্পন্ন',official:'অফিসিয়াল'};
const formatTime=(value:string|null)=>value?new Date(value).toLocaleString('bn-BD',{timeZone:'Asia/Dhaka',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}):'ফল আসেনি';

export default async function ElectionPage(){
  const settings=await getElectionSettings();
  if(settings&&!settings.public_enabled)notFound();
  const overview=await getElectionOverview();
  const live=!!settings?.live_mode;
  const electionDay=settings?.election_day?new Date(`${settings.election_day}T00:00:00+06:00`).toLocaleDateString('bn-BD',{timeZone:'Asia/Dhaka',day:'numeric',month:'long',year:'numeric'}):null;
  return <div className={styles.page}>
    {live&&<ElectionLiveRefresh seconds={15}/>} 
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <span className={styles.live}><i/>{live?'LIVE RESULT':'ELECTION RESULTS'}</span>
        <h1>{settings?.headline??'ইউনিয়ন নির্বাচন ফলাফল'}</h1>
        <p>দাউদকান্দি ও মেঘনার প্রতিটি ইউনিয়নের ফল আলাদা করে দেখুন। কেন্দ্রভিত্তিক ফল যোগ হওয়ার সাথে সাথে ইউনিয়নের মোট ফল স্বয়ংক্রিয়ভাবে পরিবর্তিত হবে।</p>
        <div className={styles.meta}><span>দাউদকান্দি</span><span>মেঘনা</span>{electionDay&&<span>ভোটের দিন {electionDay}</span>}<span>{live?'১৫ সেকেন্ড পরপর আপডেট':'প্রস্তুতিমূলক মোড'}</span></div>
      </div>
    </section>
    <div className={styles.notice}>{settings?.note??'সংগৃহীত লাইভ ফলাফল; সংশ্লিষ্ট রিটার্নিং অফিসার বা নির্বাচন কমিশনের আনুষ্ঠানিক ঘোষণাই চূড়ান্ত।'}</div>
    <section className={styles.content}>
      {overview.length?<div className={styles.grid}>{overview.map(item=>{
        const pct=item.centresTotal?Math.round(item.centresReported/item.centresTotal*100):0;
        const leader=item.candidates[0];
        const noResults=item.centresReported===0;
        return <Link className={styles.card} href={`/election/${item.election.upazila}/${item.election.union_slug}`} key={item.election.id}>
          <div className={styles.cardTop}><div><small>{upazilaName(item.election.upazila)} উপজেলা</small><h2>{item.election.union_name}</h2></div><span className={`${styles.status} ${item.election.status==='live'?styles.live:''}`}>{statusName[item.election.status]??item.election.status}</span></div>
          <div className={styles.progress}><span style={{width:`${pct}%`}}/></div>
          <div className={styles.progressText}><span>কেন্দ্র রিপোর্ট করেছে</span><b>{item.centresReported.toLocaleString('bn-BD')} / {item.centresTotal.toLocaleString('bn-BD')}</b></div>
          <div className={styles.cardStats}><span>গণনা {item.ballots.toLocaleString('bn-BD')} ভোট</span><span>{item.turnoutPct===null?'উপস্থিতি —':`উপস্থিতি ${item.turnoutPct.toLocaleString('bn-BD')}%`}</span></div>
          <div className={styles.leader}>{!leader?<><strong>প্রার্থী এখনো যোগ করা হয়নি</strong><span>Admin Panel থেকে পরে যোগ করা যাবে</span></>:noResults?<><strong>ফল আসা শুরু হয়নি</strong><span>কেন্দ্রের ফল প্রকাশ হলে এখানে দেখা যাবে</span></>:item.tied?<><strong>সমান ভোট</strong><span>শীর্ষ প্রার্থীরা {leader.votes.toLocaleString('bn-BD')} ভোটে সমান</span></>:<><strong>{leader.name}</strong><span>{leader.votes.toLocaleString('bn-BD')} ভোট{leader.symbol?` · ${leader.symbol}`:''}{item.candidates.length>1?` · ব্যবধান ${item.leadMargin.toLocaleString('bn-BD')}`:''}</span></>}</div>
          <div className={styles.lastUpdate}>সর্বশেষ আপডেট: {formatTime(item.lastUpdated)}</div>
          <div className={styles.arrow}><span>ইউনিয়নের বিস্তারিত ফল</span><b>→</b></div>
        </Link>})}</div>:<div className={styles.empty}><h2>ফলাফল সিস্টেম প্রস্তুত</h2><p>এখনো কোনো ইউনিয়ন নির্বাচন প্রকাশ করা হয়নি। Admin Panel থেকে ইউনিয়ন, প্রার্থী ও কেন্দ্র যোগ করলে এখানে দেখা যাবে।</p></div>}
    </section>
  </div>;
}
