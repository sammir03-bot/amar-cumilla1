import Link from 'next/link';
import {redirect} from 'next/navigation';
import {requireStaff} from '../../../lib/supabase';
import {upazilaNames} from '../../../lib/areas';
export default async function Areas(){const {db,role}=await requireStaff();if(role!=='admin')redirect('/admin');const {data,error}=await db.from('cumilla_areas').select('*').order('upazila').order('name');if(error)throw error;return <><h1>এলাকার তথ্য</h1><p>পরিচিতি ও তথ্যসূত্র যাচাই করে প্রতিটি এলাকা প্রকাশ করুন।</p><div className="grid two">{data?.map(a=><Link className="card" key={a.id} href={'/admin/areas/'+a.id}><h2>{a.name}</h2><p>{upazilaNames[a.upazila]} · {a.published?'প্রকাশিত':'খসড়া'}</p></Link>)}</div></>;}
