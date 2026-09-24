'use server';
import {z} from 'zod';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireStaff} from '../../../lib/supabase';

const text=(f:FormData,k:string)=>String(f.get(k)??'').trim();
const uuid=z.string().uuid();
const slug=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120);
const canManageResults=(role:string)=>role==='admin'||role==='publisher';
const voteNumber=(value:string)=>{
  const number=Number(value);
  if(!Number.isFinite(number)||number<0)return 0;
  return Math.min(100000000,Math.floor(number));
};

export type CentreSaveState={
  ok:boolean;
  message:string;
  centreId?:string;
  status?:'pending'|'reported'|'verified'|'official';
  countedVotes?:number;
  savedAt?:string;
};

function refreshElection(){
  revalidatePath('/','layout');
  revalidatePath('/election');
  revalidatePath('/admin/election');
}

function friendlyCentreError(error:unknown){
  const message=error instanceof Error?error.message:String(error??'');
  if(message==='Permission denied')return 'এই ফল পরিবর্তন করার অনুমতি আপনার নেই।';
  if(message==='Invalid centre')return 'ভোটকেন্দ্রের তথ্য সঠিক নয়। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।';
  if(message==='Invalid status')return 'ফলাফলের স্ট্যাটাস সঠিক নয়।';
  if(/duplicate key/i.test(message))return 'এই তথ্যটি আগে থেকেই আছে। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।';
  if(/network|fetch failed|timeout/i.test(message))return 'নেটওয়ার্ক সমস্যার কারণে সংরক্ষণ হয়নি। আবার চেষ্টা করুন।';
  return message||'ফল সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।';
}

export async function updateElectionSettings(f:FormData){
  const {db,role}=await requireStaff();
  if(role!=='admin')throw new Error('Permission denied');
  const headline=text(f,'headline').slice(0,180)||'লাইভ ইউনিয়ন নির্বাচন ফলাফল';
  const note=text(f,'note').slice(0,1000)||'সংগৃহীত লাইভ ফলাফল; সংশ্লিষ্ট রিটার্নিং অফিসার বা নির্বাচন কমিশনের আনুষ্ঠানিক ঘোষণাই চূড়ান্ত।';
  const electionDay=text(f,'election_day');
  const {error}=await db.from('cumilla_election_settings').update({
    live_mode:f.get('live_mode')==='on',
    public_enabled:f.get('public_enabled')==='on',
    election_day:electionDay||null,
    headline,note,updated_at:new Date().toISOString(),
  }).eq('id',1);
  if(error)throw error;
  refreshElection();
  redirect('/admin/election?saved=1');
}

export async function createElection(f:FormData){
  const {db,role}=await requireStaff();
  if(role!=='admin')throw new Error('Permission denied');
  const parsed=z.object({
    upazila:z.enum(['daudkandi','meghna']),
    union_name:z.string().min(2).max(160),
    union_slug:slug,
    title:z.string().min(2).max(180),
  }).safeParse({upazila:text(f,'upazila'),union_name:text(f,'union_name'),union_slug:text(f,'union_slug'),title:text(f,'title')||'ইউনিয়ন পরিষদ নির্বাচন'});
  if(!parsed.success)throw new Error('ইউনিয়নের তথ্য সঠিক নয়');
  const {data,error}=await db.from('cumilla_elections').insert({...parsed.data,published:false,status:'setup'}).select('id').single();
  if(error)throw error;
  refreshElection();
  redirect('/admin/election/'+data.id);
}

export async function updateElectionMeta(f:FormData){
  const {db,role}=await requireStaff();
  if(role!=='admin')throw new Error('Permission denied');
  const id=text(f,'id');if(!uuid.safeParse(id).success)throw new Error('Invalid election');
  const status=text(f,'status');if(!['setup','live','completed','official'].includes(status))throw new Error('Invalid status');
  const unionName=text(f,'union_name').slice(0,160);const title=text(f,'title').slice(0,180);
  if(!unionName||!title)throw new Error('Required fields missing');
  const sortOrder=Math.max(0,Math.floor(Number(text(f,'sort_order'))||0));
  const {error}=await db.from('cumilla_elections').update({union_name:unionName,title,status,published:f.get('published')==='on',sort_order:sortOrder,updated_at:new Date().toISOString()}).eq('id',id);
  if(error)throw error;
  refreshElection();
  redirect('/admin/election/'+id+'?saved=1');
}

export async function addCandidate(f:FormData){
  const {db,role}=await requireStaff();
  if(!canManageResults(role))throw new Error('Permission denied');
  const electionId=text(f,'election_id');if(!uuid.safeParse(electionId).success)throw new Error('Invalid election');
  const name=text(f,'name').slice(0,160);if(name.length<2)throw new Error('নাম দিন');
  const photo=text(f,'photo_url').slice(0,2000);
  if(photo&&!/^https:\/\//i.test(photo)&&!photo.startsWith('/'))throw new Error('Photo URL must be https:// or site-relative');
  const payload={election_id:electionId,name,symbol:text(f,'symbol').slice(0,120),photo_url:photo||null,description:text(f,'description').slice(0,2000),sort_order:Math.max(0,Math.floor(Number(text(f,'sort_order'))||0)),published:true};
  const {error}=await db.from('cumilla_election_candidates').insert(payload);if(error)throw error;
  refreshElection();redirect('/admin/election/'+electionId+'?saved=1');
}

export async function addCentre(f:FormData){
  const {db,role}=await requireStaff();
  if(!canManageResults(role))throw new Error('Permission denied');
  const electionId=text(f,'election_id');if(!uuid.safeParse(electionId).success)throw new Error('Invalid election');
  const code=text(f,'centre_code').slice(0,60),name=text(f,'name').slice(0,220);if(!code||!name)throw new Error('কেন্দ্রের কোড ও নাম দিন');
  const totalVoters=voteNumber(text(f,'total_voters'));
  const sortOrder=Math.max(0,Math.floor(Number(text(f,'sort_order'))||0));
  const {error}=await db.from('cumilla_election_centres').insert({election_id:electionId,centre_code:code,name,total_voters:totalVoters,sort_order:sortOrder,status:'pending'});if(error)throw error;
  refreshElection();redirect('/admin/election/'+electionId+'?saved=1');
}

export async function bulkAddCentres(f:FormData){
  const {db,role}=await requireStaff();
  if(!canManageResults(role))throw new Error('Permission denied');
  const electionId=text(f,'election_id');if(!uuid.safeParse(electionId).success)throw new Error('Invalid election');
  const raw=text(f,'centres');
  if(!raw)throw new Error('কেন্দ্রের তালিকা দিন');
  if(raw.length>60000)throw new Error('কেন্দ্রের তালিকা অনেক বড়');

  const lines=raw.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
  if(!lines.length||lines.length>300)throw new Error('১ থেকে ৩০০টি কেন্দ্র দিন');
  const byCode=new Map<string,{election_id:string;centre_code:string;name:string;total_voters:number;sort_order:number;status:string}>();

  lines.forEach((line,index)=>{
    const parts=(line.includes('\t')?line.split('\t'):line.split('|')).map(v=>v.trim());
    let code='';let name='';let voters='';
    if(parts.length>=2){
      code=parts[0];name=parts[1];voters=parts[2]??'';
    }else{
      code=String(index+1).padStart(3,'0');name=parts[0];
    }
    code=code.slice(0,60);name=name.slice(0,220);
    if(!code||!name)throw new Error(`লাইন ${index+1}: কেন্দ্র কোড ও নাম সঠিক নয়`);
    const totalVoters=voters?voteNumber(voters):0;
    byCode.set(code,{election_id:electionId,centre_code:code,name,total_voters:totalVoters,sort_order:(index+1)*10,status:'pending'});
  });

  const rows=[...byCode.values()];
  const {error}=await db.from('cumilla_election_centres').upsert(rows,{onConflict:'election_id,centre_code'});
  if(error)throw error;
  refreshElection();
  revalidatePath('/admin/election/'+electionId);
  redirect('/admin/election/'+electionId+'?saved=1');
}

async function persistCentreResult(f:FormData){
  const {db,role}=await requireStaff();
  if(!canManageResults(role))throw new Error('Permission denied');
  const centreId=text(f,'centre_id');if(!uuid.safeParse(centreId).success)throw new Error('Invalid centre');
  const {data:centre,error:centreError}=await db.from('cumilla_election_centres').select('id,election_id,status,reported_at,total_voters').eq('id',centreId).maybeSingle();
  if(centreError||!centre)throw new Error('কেন্দ্র পাওয়া যায়নি');
  const requestedStatus=text(f,'quick_status')||text(f,'status');
  if(!['pending','reported','verified','official'].includes(requestedStatus))throw new Error('Invalid status');
  const status=requestedStatus as 'pending'|'reported'|'verified'|'official';
  const invalidVotes=voteNumber(text(f,'invalid_votes'));
  const {data:candidates,error:candidateError}=await db.from('cumilla_election_candidates').select('id').eq('election_id',centre.election_id).eq('published',true);
  if(candidateError)throw candidateError;
  const rows=(candidates??[]).map(candidate=>({centre_id:centreId,candidate_id:candidate.id,votes:voteNumber(text(f,'votes_'+candidate.id)),updated_at:new Date().toISOString()}));
  const countedVotes=rows.reduce((sum,row)=>sum+row.votes,0)+invalidVotes;
  if(status!=='pending'&&!rows.length)throw new Error('প্রার্থী ছাড়া কেন্দ্রের ফল প্রকাশ করা যাবে না।');
  if(status!=='pending'&&countedVotes===0)throw new Error('শূন্য ভোট দিয়ে কেন্দ্রের ফল প্রকাশ করা যাবে না। আগে ভোটের সংখ্যা দিন।');
  if(centre.total_voters>0&&countedVotes>centre.total_voters){
    throw new Error(`মোট গণনা করা ভোট (${countedVotes.toLocaleString('bn-BD')}) কেন্দ্রের মোট ভোটার (${centre.total_voters.toLocaleString('bn-BD')})-এর বেশি হতে পারে না।`);
  }
  if(rows.length){const {error}=await db.from('cumilla_election_results').upsert(rows,{onConflict:'centre_id,candidate_id'});if(error)throw error;}
  const now=new Date().toISOString();
  const centreUpdate:any={status,invalid_votes:invalidVotes,updated_at:now};
  if(status!=='pending'&&!centre.reported_at)centreUpdate.reported_at=now;
  if(status==='pending'||status==='reported')centreUpdate.verified_at=null;
  if(['verified','official'].includes(status))centreUpdate.verified_at=now;
  const {error:updateError}=await db.from('cumilla_election_centres').update(centreUpdate).eq('id',centreId);if(updateError)throw updateError;
  refreshElection();
  revalidatePath('/election','layout');
  revalidatePath('/admin/election/'+centre.election_id);
  return {centreId,electionId:centre.election_id,status,countedVotes,savedAt:now};
}

export async function saveCentreResult(f:FormData){
  const saved=await persistCentreResult(f);
  redirect('/admin/election/'+saved.electionId+'?saved=1');
}

export async function saveCentreResultInline(_previous:CentreSaveState,f:FormData):Promise<CentreSaveState>{
  try{
    const saved=await persistCentreResult(f);
    const statusLabel:Record<string,string>={pending:'অপেক্ষমাণ',reported:'ফল পাওয়া গেছে',verified:'যাচাইকৃত',official:'অফিসিয়াল'};
    return {ok:true,message:`সংরক্ষণ হয়েছে · ${statusLabel[saved.status]}`,centreId:saved.centreId,status:saved.status,countedVotes:saved.countedVotes,savedAt:saved.savedAt};
  }catch(error){
    return {ok:false,message:friendlyCentreError(error)};
  }
}
