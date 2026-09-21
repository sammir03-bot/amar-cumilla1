import Link from 'next/link';
import {requireStaff} from '../../lib/supabase';
import {logout} from '../login/actions';
export const metadata={title:'Admin',robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){const {role}=await requireStaff();return <div className="admin-shell"><aside className="admin-nav"><h2>সম্পাদনা কেন্দ্র</h2><p>{role}</p><nav aria-label="Admin মেনু"><Link href="/admin">সারসংক্ষেপ</Link><Link href="/admin/content">সব প্রকাশনা</Link><Link href="/admin/content/new">নতুন প্রকাশনা</Link>{role==='admin'&&<><Link href="/admin/areas">এলাকার তথ্য</Link><Link href="/admin/audit">পরিবর্তনের ইতিহাস</Link></>}<Link href="/admin/media">ছবি ও PDF</Link></nav><form action={logout}><button className="secondary">লগআউট</button></form></aside><div className="admin-content">{children}</div></div>;}
