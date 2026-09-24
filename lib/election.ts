import 'server-only';
import {cache} from 'react';
import {publicDb} from './supabase';

export type ElectionSettings={
  id:number;live_mode:boolean;public_enabled:boolean;election_day:string|null;headline:string;note:string;updated_at:string;
};
export type Election={
  id:string;upazila:'daudkandi'|'meghna';union_slug:string;union_name:string;title:string;status:'setup'|'live'|'completed'|'official';published:boolean;sort_order:number;created_at:string;updated_at:string;
};
export type ElectionCandidate={id:string;election_id:string;name:string;symbol:string;photo_url:string|null;description:string;sort_order:number;published:boolean};
export type ElectionCentre={id:string;election_id:string;centre_code:string;name:string;total_voters:number;invalid_votes:number;status:'pending'|'reported'|'verified'|'official';reported_at:string|null;verified_at:string|null;sort_order:number;updated_at:string};
export type ElectionResult={id:string;centre_id:string;candidate_id:string;votes:number;updated_at:string};

const isReported=(centre:ElectionCentre)=>centre.status!=='pending';

function latestIso(values:(string|null|undefined)[]){
  const valid=values.filter((value):value is string=>!!value);
  if(!valid.length)return null;
  return valid.reduce((latest,value)=>new Date(value).getTime()>new Date(latest).getTime()?value:latest);
}

function resultSummary(centres:ElectionCentre[],candidates:ElectionCandidate[],results:ElectionResult[]){
  const reportedCentres=centres.filter(isReported);
  const reportedIds=new Set(reportedCentres.map(centre=>centre.id));
  const visibleResults=results.filter(result=>reportedIds.has(result.centre_id));
  const voteTotals=new Map<string,number>();
  visibleResults.forEach(result=>voteTotals.set(result.candidate_id,(voteTotals.get(result.candidate_id)??0)+result.votes));
  const candidateTotals=candidates.map(candidate=>({...candidate,votes:voteTotals.get(candidate.id)??0})).sort((a,b)=>b.votes-a.votes||a.sort_order-b.sort_order);
  const validVotes=candidateTotals.reduce((sum,candidate)=>sum+candidate.votes,0);
  const invalidVotes=reportedCentres.reduce((sum,centre)=>sum+(centre.invalid_votes??0),0);
  const ballots=validVotes+invalidVotes;
  const registeredReported=reportedCentres.reduce((sum,centre)=>sum+(centre.total_voters??0),0);
  const turnoutPct=registeredReported?Math.min(100,Math.round(ballots/registeredReported*1000)/10):null;
  const tied=reportedCentres.length>0&&candidateTotals.length>1&&candidateTotals[0].votes===candidateTotals[1].votes;
  const leadMargin=reportedCentres.length>0&&candidateTotals.length>1&&!tied?Math.max(0,candidateTotals[0].votes-candidateTotals[1].votes):0;
  const lastUpdated=latestIso(reportedCentres.flatMap(centre=>[centre.reported_at,centre.verified_at,centre.updated_at]));
  return {reportedCentres,candidateTotals,validVotes,invalidVotes,ballots,registeredReported,turnoutPct,tied,leadMargin,lastUpdated};
}

export const getElectionSettings=cache(async()=>{
  const {data,error}=await publicDb().from('cumilla_election_settings').select('*').eq('id',1).maybeSingle();
  if(error)throw new Error('নির্বাচন সেটিংস আনা যায়নি');
  return data as ElectionSettings|null;
});

export async function getElectionOverview(){
  const db=publicDb();
  const {data:elections,error}=await db.from('cumilla_elections').select('*').eq('published',true).order('sort_order').order('union_name');
  if(error)throw new Error('নির্বাচনের তালিকা আনা যায়নি');
  const list=(elections??[]) as Election[];
  if(!list.length)return [];
  const ids=list.map(e=>e.id);
  const [candidateRes,centreRes]=await Promise.all([
    db.from('cumilla_election_candidates').select('*').in('election_id',ids).eq('published',true).order('sort_order'),
    db.from('cumilla_election_centres').select('*').in('election_id',ids).order('sort_order'),
  ]);
  if(candidateRes.error||centreRes.error)throw new Error('লাইভ ফলাফলের তথ্য আনা যায়নি');
  const candidates=(candidateRes.data??[]) as ElectionCandidate[];
  const centres=(centreRes.data??[]) as ElectionCentre[];
  const centreIds=centres.map(c=>c.id);
  let results:ElectionResult[]=[];
  if(centreIds.length){
    const resultRes=await db.from('cumilla_election_results').select('*').in('centre_id',centreIds);
    if(resultRes.error)throw new Error('ভোটের ফল আনা যায়নি');
    results=(resultRes.data??[]) as ElectionResult[];
  }
  return list.map(election=>{
    const electionCentres=centres.filter(centre=>centre.election_id===election.id);
    const electionCandidates=candidates.filter(candidate=>candidate.election_id===election.id);
    const centreIdsForElection=new Set(electionCentres.map(centre=>centre.id));
    const electionResults=results.filter(result=>centreIdsForElection.has(result.centre_id));
    const summary=resultSummary(electionCentres,electionCandidates,electionResults);
    return {
      election,
      centresTotal:electionCentres.length,
      centresReported:summary.reportedCentres.length,
      candidates:summary.candidateTotals,
      validVotes:summary.validVotes,
      invalidVotes:summary.invalidVotes,
      ballots:summary.ballots,
      registeredReported:summary.registeredReported,
      turnoutPct:summary.turnoutPct,
      tied:summary.tied,
      leadMargin:summary.leadMargin,
      lastUpdated:summary.lastUpdated,
    };
  });
}

export async function getElectionDetail(upazila:string,unionSlug:string){
  if(!['daudkandi','meghna'].includes(upazila))return null;
  const db=publicDb();
  const {data:election,error}=await db.from('cumilla_elections').select('*').eq('published',true).eq('upazila',upazila).eq('union_slug',unionSlug).maybeSingle();
  if(error)throw new Error('নির্বাচনের তথ্য আনা যায়নি');
  if(!election)return null;
  const e=election as Election;
  const [candidateRes,centreRes]=await Promise.all([
    db.from('cumilla_election_candidates').select('*').eq('election_id',e.id).eq('published',true).order('sort_order'),
    db.from('cumilla_election_centres').select('*').eq('election_id',e.id).order('sort_order').order('centre_code'),
  ]);
  if(candidateRes.error||centreRes.error)throw new Error('নির্বাচনের বিস্তারিত তথ্য আনা যায়নি');
  const candidates=(candidateRes.data??[]) as ElectionCandidate[];
  const centres=(centreRes.data??[]) as ElectionCentre[];
  let results:ElectionResult[]=[];
  if(centres.length){
    const resultRes=await db.from('cumilla_election_results').select('*').in('centre_id',centres.map(c=>c.id));
    if(resultRes.error)throw new Error('কেন্দ্রের ফল আনা যায়নি');
    results=(resultRes.data??[]) as ElectionResult[];
  }
  const summary=resultSummary(centres,candidates,results);
  const resultMap=new Map(results.map(result=>[`${result.centre_id}:${result.candidate_id}`,result.votes]));
  const centreRows=centres.map(centre=>({
    ...centre,
    results:candidates.map(candidate=>({candidate_id:candidate.id,name:candidate.name,symbol:candidate.symbol,votes:resultMap.get(`${centre.id}:${candidate.id}`)??0})),
  }));
  return {
    election:e,
    candidates:summary.candidateTotals,
    centres:centreRows,
    centresReported:summary.reportedCentres.length,
    validVotes:summary.validVotes,
    invalidVotes:summary.invalidVotes,
    ballots:summary.ballots,
    registeredReported:summary.registeredReported,
    turnoutPct:summary.turnoutPct,
    tied:summary.tied,
    leadMargin:summary.leadMargin,
    lastUpdated:summary.lastUpdated,
  };
}
