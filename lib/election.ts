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
  const centreElection=new Map(centres.map(c=>[c.id,c.election_id]));
  return list.map(election=>{
    const ec=centres.filter(c=>c.election_id===election.id);
    const reported=ec.filter(c=>c.status!=='pending');
    const totals=candidates.filter(c=>c.election_id===election.id).map(candidate=>({
      ...candidate,
      votes:results.filter(r=>r.candidate_id===candidate.id&&centreElection.get(r.centre_id)===election.id).reduce((sum,r)=>sum+r.votes,0),
    })).sort((a,b)=>b.votes-a.votes||a.sort_order-b.sort_order);
    return {election,centresTotal:ec.length,centresReported:reported.length,candidates:totals};
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
  const totals=candidates.map(candidate=>({...candidate,votes:results.filter(r=>r.candidate_id===candidate.id).reduce((sum,r)=>sum+r.votes,0)})).sort((a,b)=>b.votes-a.votes||a.sort_order-b.sort_order);
  const centreRows=centres.map(centre=>({
    ...centre,
    results:candidates.map(candidate=>({candidate_id:candidate.id,name:candidate.name,symbol:candidate.symbol,votes:results.find(r=>r.centre_id===centre.id&&r.candidate_id===candidate.id)?.votes??0})),
  }));
  return {election:e,candidates:totals,centres:centreRows,centresReported:centres.filter(c=>c.status!=='pending').length};
}
