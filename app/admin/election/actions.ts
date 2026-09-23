'use server';
import {z} from 'zod';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireStaff} from '../../../lib/supabase';

const text=(f:FormData,k:string)=>String(f.get(k)??'').trim();
const uuid=z.string().uuid();
const slug=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120);
const canManageResults=(role:string)=>role==='admin'||role==='publisher';

function refreshElection(){
  revalidatePath('/','layout');
  revalidatePath('/election');
  revalidatePath('/admin/election');
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
  const totalVoters=Math.max(0,Math.floor(Number(text(f,'total_voters'))||0));
  const sortOrder=Math.max(0,Math.floor(Number(text(f,'sort_order'))||0));
  const {error}=await db.from('cumilla_election_centres').insert({election_id:electionId,centre_code:code,name,total_voters:totalVoters,sort_order:sortOrder,status:'pending'});if(error)throw error;
  refreshElection();redirect('/admin/election/'+electionId+'?saved=1');
}

export async function saveCentreResult(f:FormData){
  const {db,role}=await requireStaff();
  if(!canManageResults(role))throw new Error('Permission denied');
  const centreId=text(f,'centre_id');if(!uuid.safeParse(centreId).success)throw new Error('Invalid centre');
  const {data:centre,error:centreError}=await db.from('cumilla_election_centres').select('id,election_id,status').eq('id',centreId).maybeSingle();
  if(centreError||!centre)throw new Error('কেন্দ্র পাওয়া যায়নি');
  const status=text(f,'status');if(!['pending','reported','verified','official'].includes(status))throw new Error('Invalid status');
  const invalidVotes=Math.max(0,Math.floor(Number(text(f,'invalid_votes'))||0));
  const {data:candidates,error:candidateError}=await db.from('cumilla_election_candidates').select('id').eq('election_id',centre.election_id);
  if(candidateError)throw candidateError;
  const rows=(candidates??[]).map(candidate=>({centre_id:centreId,candidate_id:candidate.id,votes:Math.max(0,Math.floor(Number(text(f,'votes_'+candidate.id))||0)),updated_at:new Date().toISOString()}));
  if(rows.length){const {error}=await db.from('cumilla_election_results').upsert(rows,{onConflict:'centre_id,candidate_id'});if(error)throw error;}
  const now=new Date().toISOString();
  const centreUpdate:any={status,invalid_votes:invalidVotes,updated_at:now};
  if(status!=='pending'&&!centre.reported_at)centreUpdate.reported_at=now;
  if(['verified','official'].includes(status))centreUpdate.verified_at=now;
  const {error:updateError}=await db.from('cumilla_election_centres').update(centreUpdate).eq('id',centreId);if(updateError)throw updateError;
  refreshElection();
  revalidatePath('/election','layout');
  redirect('/admin/election/'+centre.election_id+'?saved=1');
}
