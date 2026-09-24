'use client';

import {useActionState,useEffect,useMemo,useState} from 'react';
import {useRouter} from 'next/navigation';
import {saveCentreResultInline,type CentreSaveState} from '../app/admin/election/actions';
import styles from './election-result-control-room.module.css';

type Candidate={id:string;name:string;symbol:string};
type CentreStatus='pending'|'reported'|'verified'|'official';
type CentreResult={candidate_id:string;votes:number};
type Centre={
  id:string;
  centre_code:string;
  name:string;
  total_voters:number;
  invalid_votes:number;
  status:CentreStatus;
  updated_at:string;
  results:CentreResult[];
};

type Props={centres:Centre[];candidates:Candidate[];canEdit:boolean};

const statusLabel:Record<CentreStatus,string>={pending:'অপেক্ষমাণ',reported:'ফল এসেছে',verified:'যাচাইকৃত',official:'অফিসিয়াল'};
const filters:{value:'all'|CentreStatus;label:string}[]=[
  {value:'all',label:'সব কেন্দ্র'},
  {value:'pending',label:'অপেক্ষমাণ'},
  {value:'reported',label:'ফল এসেছে'},
  {value:'verified',label:'যাচাইকৃত'},
  {value:'official',label:'অফিসিয়াল'},
];
const initialState:CentreSaveState={ok:false,message:''};
const num=(value:string)=>{
  const parsed=Number(value);
  return Number.isFinite(parsed)&&parsed>0?Math.floor(parsed):0;
};

function CentreResultForm({centre,candidates,canEdit}:{centre:Centre;candidates:Candidate[];canEdit:boolean}){
  const router=useRouter();
  const [state,action,pending]=useActionState(saveCentreResultInline,initialState);
  const initialVotes=Object.fromEntries(candidates.map(candidate=>[candidate.id,centre.results.find(result=>result.candidate_id===candidate.id)?.votes??0]));
  const [votes,setVotes]=useState<Record<string,number>>(initialVotes);
  const [invalidVotes,setInvalidVotes]=useState(centre.invalid_votes??0);
  const [status,setStatus]=useState<CentreStatus>(centre.status);
  const countedVotes=Object.values(votes).reduce((sum,value)=>sum+value,0)+invalidVotes;
  const overLimit=centre.total_voters>0&&countedVotes>centre.total_voters;
  const remaining=centre.total_voters>0?centre.total_voters-countedVotes:null;

  useEffect(()=>{
    if(!state.ok||!state.savedAt)return;
    if(state.status)setStatus(state.status);
    router.refresh();
  },[router,state.ok,state.savedAt,state.status]);

  return <form action={action} className={`${styles.card} ${styles[status]}`}>
    <input type="hidden" name="centre_id" value={centre.id}/>
    <div className={styles.cardHead}>
      <div className={styles.centreTitle}>
        <span className={styles.code}>{centre.centre_code}</span>
        <div><strong>{centre.name}</strong><small>মোট ভোটার {centre.total_voters?centre.total_voters.toLocaleString('bn-BD'):'যোগ করা হয়নি'}</small></div>
      </div>
      <span className={`${styles.badge} ${styles[`badge_${status}`]}`}>{statusLabel[status]}</span>
    </div>

    <div className={styles.voteGrid}>{candidates.map(candidate=><label key={candidate.id} className={styles.voteField}>
      <span>{candidate.name}<small>{candidate.symbol||'প্রতীক নেই'}</small></span>
      <input
        inputMode="numeric"
        type="number"
        min="0"
        name={`votes_${candidate.id}`}
        value={votes[candidate.id]??0}
        onChange={event=>setVotes(current=>({...current,[candidate.id]:num(event.target.value)}))}
        disabled={!canEdit||pending}
      />
    </label>)}</div>

    <div className={styles.metaGrid}>
      <label><span>বাতিল ভোট</span><input inputMode="numeric" type="number" min="0" name="invalid_votes" value={invalidVotes} onChange={event=>setInvalidVotes(num(event.target.value))} disabled={!canEdit||pending}/></label>
      <label><span>স্ট্যাটাস</span><select name="status" value={status} onChange={event=>setStatus(event.target.value as CentreStatus)} disabled={!canEdit||pending}>{Object.entries(statusLabel).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
      <div className={`${styles.totalBox} ${overLimit?styles.totalError:''}`}><span>মোট গণনা</span><strong>{countedVotes.toLocaleString('bn-BD')}</strong><small>{remaining===null?'মোট ভোটার যোগ করলে সীমা যাচাই হবে':overLimit?`সীমার চেয়ে ${Math.abs(remaining).toLocaleString('bn-BD')} বেশি`:`সীমার মধ্যে ${remaining.toLocaleString('bn-BD')} বাকি`}</small></div>
    </div>

    {overLimit&&<div className={styles.inlineError}>⚠ মোট গণনা করা ভোট কেন্দ্রের মোট ভোটারের চেয়ে বেশি। সংখ্যা ঠিক না করা পর্যন্ত সংরক্ষণ বন্ধ থাকবে।</div>}
    {state.message&&<div className={`${styles.saveMessage} ${state.ok?styles.saveSuccess:styles.saveError}`}>{state.ok?'✓':'⚠'} {state.message}</div>}

    <div className={styles.actions}>
      <button type="submit" className={styles.secondary} disabled={!canEdit||pending||overLimit}>{pending?'সংরক্ষণ হচ্ছে…':'শুধু সংরক্ষণ'}</button>
      <button type="submit" name="quick_status" value="reported" disabled={!canEdit||pending||overLimit}>ফল এসেছে</button>
      <button type="submit" name="quick_status" value="verified" disabled={!canEdit||pending||overLimit}>✓ যাচাইকৃত</button>
      <button type="submit" name="quick_status" value="official" className={styles.officialButton} disabled={!canEdit||pending||overLimit}>অফিসিয়াল</button>
    </div>
  </form>;
}

export default function ElectionResultControlRoom({centres,candidates,canEdit}:Props){
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState<'all'|CentreStatus>('all');
  const counts=useMemo(()=>centres.reduce((acc,centre)=>{acc[centre.status]+=1;return acc;},{pending:0,reported:0,verified:0,official:0} as Record<CentreStatus,number>),[centres]);
  const reportedTotal=centres.length-counts.pending;
  const filtered=useMemo(()=>{
    const needle=query.trim().toLocaleLowerCase('bn-BD');
    return centres.filter(centre=>{
      const statusMatch=filter==='all'||centre.status===filter;
      const textMatch=!needle||`${centre.centre_code} ${centre.name}`.toLocaleLowerCase('bn-BD').includes(needle);
      return statusMatch&&textMatch;
    });
  },[centres,filter,query]);

  return <div className={styles.room}>
    <div className={styles.summary}>
      <article><span>মোট কেন্দ্র</span><strong>{centres.length.toLocaleString('bn-BD')}</strong><small>সেটআপ করা হয়েছে</small></article>
      <article className={styles.summaryLive}><span>ফল এসেছে</span><strong>{reportedTotal.toLocaleString('bn-BD')}</strong><small>{centres.length?Math.round(reportedTotal/centres.length*100).toLocaleString('bn-BD'):0}% রিপোর্টিং</small></article>
      <article><span>যাচাইকৃত</span><strong>{counts.verified.toLocaleString('bn-BD')}</strong><small>দ্বিতীয়বার দেখা হয়েছে</small></article>
      <article><span>অফিসিয়াল</span><strong>{counts.official.toLocaleString('bn-BD')}</strong><small>চূড়ান্ত হিসেবে চিহ্নিত</small></article>
    </div>

    <div className={styles.toolbar}>
      <div className={styles.searchWrap}><span>⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="কেন্দ্রের নাম বা কোড…" aria-label="কেন্দ্র খুঁজুন"/></div>
      <div className={styles.filters}>{filters.map(item=><button type="button" key={item.value} onClick={()=>setFilter(item.value)} className={filter===item.value?styles.activeFilter:''}>{item.label}{item.value!=='all'&&<b>{counts[item.value].toLocaleString('bn-BD')}</b>}</button>)}</div>
    </div>

    {!canEdit&&<div className={styles.readOnly}>এই অ্যাকাউন্ট থেকে ফল দেখা যাবে, কিন্তু পরিবর্তন করা যাবে না।</div>}
    {!candidates.length&&<div className={styles.readOnly}>প্রার্থী যোগ না করা পর্যন্ত কেন্দ্রের ফল ইনপুট করা যাবে না।</div>}

    <div className={styles.list}>{filtered.map(centre=><CentreResultForm key={`${centre.id}:${centre.status}:${centre.updated_at}`} centre={centre} candidates={candidates} canEdit={canEdit&&candidates.length>0}/>)}</div>
    {!filtered.length&&<div className={styles.empty}>এই খোঁজ বা ফিল্টারে কোনো কেন্দ্র পাওয়া যায়নি।</div>}
  </div>;
}
