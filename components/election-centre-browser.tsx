'use client';

import {useMemo,useState} from 'react';
import styles from '../app/election/election.module.css';

type CentreResult={candidate_id:string;name:string;symbol:string;votes:number};
type Centre={
  id:string;
  centre_code:string;
  name:string;
  total_voters:number;
  invalid_votes:number;
  status:'pending'|'reported'|'verified'|'official';
  results:CentreResult[];
};

const centreStatus:Record<Centre['status'],string>={pending:'অপেক্ষমাণ',reported:'ফল পাওয়া গেছে',verified:'যাচাইকৃত',official:'অফিসিয়াল'};
const filters:[string,string][]=[['all','সব কেন্দ্র'],['reported','ফল এসেছে'],['verified','যাচাইকৃত'],['official','অফিসিয়াল'],['pending','অপেক্ষমাণ']];

export default function ElectionCentreBrowser({centres}:{centres:Centre[]}){
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState('all');
  const filtered=useMemo(()=>{
    const needle=query.trim().toLocaleLowerCase('bn-BD');
    return centres.filter(centre=>{
      const matchesQuery=!needle||`${centre.centre_code} ${centre.name}`.toLocaleLowerCase('bn-BD').includes(needle);
      const matchesFilter=filter==='all'||(filter==='reported'?centre.status!=='pending':centre.status===filter);
      return matchesQuery&&matchesFilter;
    });
  },[centres,filter,query]);

  return <section className={styles.centreBrowser}>
    <div className={styles.browserHead}>
      <div><small>ভোটকেন্দ্র খুঁজুন</small><h2>কেন্দ্রভিত্তিক ফলাফল</h2></div>
      <strong>{filtered.length.toLocaleString('bn-BD')} / {centres.length.toLocaleString('bn-BD')} কেন্দ্র</strong>
    </div>
    <input className={styles.searchInput} value={query} onChange={event=>setQuery(event.target.value)} placeholder="কেন্দ্রের নাম বা কোড লিখুন…" aria-label="ভোটকেন্দ্র খুঁজুন"/>
    <div className={styles.filterRow}>{filters.map(([value,label])=><button type="button" key={value} onClick={()=>setFilter(value)} className={filter===value?styles.filterActive:''}>{label}</button>)}</div>
    <div className={styles.centreList}>{filtered.map(centre=><article className={`${styles.centre} ${centre.status==='pending'?styles.pending:''}`} key={centre.id}>
      <div className={styles.centreTop}><div><h3>{centre.centre_code} · {centre.name}</h3><p>{centre.total_voters?`মোট ভোটার ${centre.total_voters.toLocaleString('bn-BD')}`:'মোট ভোটার পরে যোগ করা যাবে'} · {centreStatus[centre.status]}</p></div><strong>{centre.status==='pending'?'—':centreStatus[centre.status]}</strong></div>
      {centre.status!=='pending'&&centre.results.map(result=><div className={styles.resultRow} key={result.candidate_id}><span>{result.name}{result.symbol?` · ${result.symbol}`:''}</span><b>{result.votes.toLocaleString('bn-BD')}</b></div>)}
      {centre.status!=='pending'&&centre.invalid_votes>0&&<div className={styles.resultRow}><span>বাতিল ভোট</span><b>{centre.invalid_votes.toLocaleString('bn-BD')}</b></div>}
    </article>)}</div>
    {!filtered.length&&<div className={styles.empty}>এই খোঁজ বা ফিল্টারে কোনো কেন্দ্র পাওয়া যায়নি।</div>}
  </section>;
}
