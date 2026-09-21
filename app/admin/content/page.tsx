import Link from 'next/link';
import {requireStaff} from '../../../lib/supabase';
import {kinds} from '../../../lib/content';

const statusNames:Record<string,string>={draft:'খসড়া',review:'পর্যালোচনা',published:'প্রকাশিত',archived:'আর্কাইভ'};
const allowedStatuses=['draft','review','published','archived'];
const allowedKinds=Object.keys(kinds);

export default async function Content({searchParams}:{searchParams:Promise<{page?:string;q?:string;status?:string;kind?:string}>}){
  const {db}=await requireStaff();
  const params=await searchParams;
  const page=Math.max(1,Number(params.page)||1);
  const term=(params.q??'').trim().slice(0,80);
  const status=allowedStatuses.includes(params.status??'')?params.status??'':'';
  const kind=allowedKinds.includes(params.kind??'')?params.kind??'':'';

  let query=db.from('cumilla_posts').select('id,title,kind,status,updated_at',{count:'exact'});
  if(term)query=query.ilike('title',`%${term}%`);
  if(status)query=query.eq('status',status);
  if(kind)query=query.eq('kind',kind);
  const {data,error,count}=await query.order('updated_at',{ascending:false}).range((page-1)*20,page*20-1);
  if(error)throw error;

  const pageHref=(next:number)=>{
    const qs=new URLSearchParams();
    if(term)qs.set('q',term);if(status)qs.set('status',status);if(kind)qs.set('kind',kind);qs.set('page',String(next));
    return '?'+qs.toString();
  };

  return <section>
    <div className="admin-page-header">
      <div><p className="eyebrow">কনটেন্ট</p><h1>সব প্রকাশনা</h1><p>শিরোনাম খুঁজুন, অবস্থা বা বিভাগ দিয়ে ফিল্টার করুন, তারপর সরাসরি সম্পাদনা করুন।</p></div>
      <div className="admin-page-actions"><Link className="admin-btn primary" href="/admin/content/new">＋ নতুন প্রকাশনা</Link></div>
    </div>

    <div className="admin-toolbar">
      <form className="admin-filters" method="get">
        <input name="q" defaultValue={term} placeholder="শিরোনাম দিয়ে খুঁজুন…" aria-label="প্রকাশনা খুঁজুন"/>
        <select name="status" defaultValue={status} aria-label="অবস্থা"><option value="">সব অবস্থা</option>{allowedStatuses.map(s=><option key={s} value={s}>{statusNames[s]}</option>)}</select>
        <select name="kind" defaultValue={kind} aria-label="বিভাগ"><option value="">সব বিভাগ</option>{Object.entries(kinds).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
        <button type="submit">ফিল্টার</button>
        {(term||status||kind)&&<Link className="admin-filter-reset" href="/admin/content">রিসেট</Link>}
      </form>
    </div>

    <div className="admin-table">
      {data?.map(p=><Link className="admin-row" key={p.id} href={'/admin/content/'+p.id}>
        <div className="admin-row-title"><strong>{p.title}</strong><small>আপডেট: {new Date(p.updated_at).toLocaleDateString('bn-BD',{timeZone:'Asia/Dhaka'})}</small></div>
        <span className="admin-row-kind">{kinds[p.kind]??p.kind}</span>
        <span className={'admin-status '+p.status}>{statusNames[p.status]??p.status}</span>
        <span className="admin-row-arrow">→</span>
      </Link>)}
      {!data?.length&&<div className="admin-empty">এই ফিল্টারে কোনো প্রকাশনা পাওয়া যায়নি।</div>}
    </div>

    <nav className="admin-pagination" aria-label="পৃষ্ঠা পরিবর্তন">
      <span>{page>1?<Link href={pageHref(page-1)}>← আগের পাতা</Link>:<span/>}</span>
      <span>{page*20<(count??0)&&<Link href={pageHref(page+1)}>পরের পাতা →</Link>}</span>
    </nav>
  </section>;
}
