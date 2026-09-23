import Link from 'next/link';
import {requireStaff} from '../../../lib/supabase';
import {updateSubmissionStatus} from './actions';

const typeNames:Record<string,string>={join:'যোগদানের আগ্রহ',problem:'এলাকার সমস্যা',feedback:'মতামত/পরামর্শ'};
const statusNames:Record<string,string>={new:'নতুন',reviewing:'পর্যালোচনায়',resolved:'সম্পন্ন',archived:'আর্কাইভ'};
const allowedTypes=['join','problem','feedback'];
const allowedStatuses=['new','reviewing','resolved','archived'];

export default async function Submissions({searchParams}:{searchParams:Promise<{type?:string;status?:string}>}){
  const {db,role}=await requireStaff();
  const q=await searchParams;
  const type=allowedTypes.includes(q.type??'')?q.type??'':'';
  const status=allowedStatuses.includes(q.status??'')?q.status??'':'';

  let query=db.from('cumilla_submissions').select('*').order('created_at',{ascending:false}).limit(100);
  if(type)query=query.eq('type',type);
  if(status)query=query.eq('status',status);

  const [rows,joinCount,problemCount,feedbackCount,newCount]=await Promise.all([
    query,
    db.from('cumilla_submissions').select('id',{count:'exact',head:true}).eq('type','join'),
    db.from('cumilla_submissions').select('id',{count:'exact',head:true}).eq('type','problem'),
    db.from('cumilla_submissions').select('id',{count:'exact',head:true}).eq('type','feedback'),
    db.from('cumilla_submissions').select('id',{count:'exact',head:true}).eq('status','new'),
  ]);
  if(rows.error)throw rows.error;

  const cards=[
    ['join','যোগদানের আগ্রহ',joinCount.count??0,'✦'],
    ['problem','এলাকার সমস্যা',problemCount.count??0,'!'],
    ['feedback','মতামত/পরামর্শ',feedbackCount.count??0,'“'],
  ] as const;

  return <section>
    <div className="admin-page-header">
      <div><p className="eyebrow">জনসম্পৃক্ততা</p><h1>ফর্ম ইনবক্স</h1><p>যোগদানের আগ্রহ, এলাকার সমস্যা এবং মানুষের মতামত—সব আলাদা করে দেখুন ও স্ট্যাটাস দিন।</p></div>
      <div className="admin-page-actions"><span className="admin-saved">নতুন: {newCount.count??0}</span></div>
    </div>

    <div className="submission-summary">
      {cards.map(([key,label,count,icon])=><Link className={'submission-summary-card '+(type===key?'active':'')} href={'/admin/submissions?type='+key} key={key}><span>{icon}</span><div><strong>{count.toLocaleString('bn-BD')}</strong><small>{label}</small></div></Link>)}
    </div>

    <div className="admin-toolbar">
      <form className="admin-filters" method="get">
        <select name="type" defaultValue={type}><option value="">সব ফর্ম</option>{allowedTypes.map(k=><option value={k} key={k}>{typeNames[k]}</option>)}</select>
        <select name="status" defaultValue={status}><option value="">সব স্ট্যাটাস</option>{allowedStatuses.map(s=><option value={s} key={s}>{statusNames[s]}</option>)}</select>
        <button type="submit">ফিল্টার</button>
        {(type||status)&&<Link className="admin-filter-reset" href="/admin/submissions">রিসেট</Link>}
      </form>
    </div>

    <div className="submission-list">
      {rows.data?.map((item:any)=><article className="submission-card" key={item.id}>
        <div className="submission-card-top">
          <div><span className={'submission-type '+item.type}>{typeNames[item.type]??item.type}</span><h2>{item.subject||item.full_name}</h2><p>{item.full_name} · {item.upazila==='daudkandi'?'দাউদকান্দি':'মেঘনা'}{item.union_name?' · '+item.union_name:''}</p></div>
          <time>{new Date(item.created_at).toLocaleString('bn-BD',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Dhaka'})}</time>
        </div>

        <p className="submission-message">{item.message}</p>

        <div className="submission-contact">
          {item.phone&&<span><b>ফোন</b> {item.phone}</span>}
          {item.email&&<span><b>ইমেইল</b> {item.email}</span>}
        </div>

        <div className="submission-card-bottom">
          <span className={'submission-status '+item.status}>{statusNames[item.status]??item.status}</span>
          {role!=='editor'&&<form action={updateSubmissionStatus} className="submission-status-form">
            <input type="hidden" name="id" value={item.id}/>
            <select name="status" defaultValue={item.status}>{allowedStatuses.map(s=><option value={s} key={s}>{statusNames[s]}</option>)}</select>
            <button type="submit">আপডেট</button>
          </form>}
        </div>
      </article>)}
      {!rows.data?.length&&<div className="admin-empty">এই ফিল্টারে কোনো জমা পাওয়া যায়নি।</div>}
    </div>
  </section>;
}
