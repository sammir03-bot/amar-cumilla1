import Link from 'next/link';
import {requireStaff} from '../../lib/supabase';
import {logout} from '../login/actions';
import './admin.css';
import './admin-fixes.css';

export const metadata={title:'Admin',robots:{index:false,follow:false}};

const roleNames={admin:'অ্যাডমিন',publisher:'প্রকাশক',editor:'সম্পাদক'} as const;

export default async function AdminLayout({children}:{children:React.ReactNode}){
  const {role,user}=await requireStaff();
  return <div className="admin-app">
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <img className="admin-brand-logo" src="/logo.svg" alt="আমার কুমিল্লা এক লোগো" width="46" height="46"/>
        <span><strong>সম্পাদনা কেন্দ্র</strong><small>আমার কুমিল্লা এক</small></span>
      </div>

      <Link className="admin-create" href="/admin/content/new"><span>＋</span> নতুন প্রকাশনা</Link>

      <nav className="admin-menu" aria-label="Admin মেনু">
        <span className="admin-menu-label">প্রধান</span>
        <Link href="/admin"><span className="admin-menu-icon">⌂</span><span>ড্যাশবোর্ড</span></Link>
        <Link href="/admin/content"><span className="admin-menu-icon">▤</span><span>সব প্রকাশনা</span></Link>
        <Link href="/admin/submissions"><span className="admin-menu-icon">✉</span><span>ফর্ম ইনবক্স</span></Link>
        <Link href="/admin/election"><span className="admin-menu-icon">◉</span><span>নির্বাচন ও লাইভ ফল</span></Link>
        <Link href="/admin/media"><span className="admin-menu-icon">▧</span><span>ছবি ও PDF</span></Link>

        {role==='admin'&&<>
          <span className="admin-menu-label admin-menu-space">পরিচালনা</span>
          <Link href="/admin/areas"><span className="admin-menu-icon">⌖</span><span>এলাকার তথ্য</span></Link>
          <Link href="/admin/audit"><span className="admin-menu-icon">↺</span><span>পরিবর্তনের ইতিহাস</span></Link>
        </>}
      </nav>

      <div className="admin-sidebar-bottom">
        <Link className="admin-site-link" href="/" target="_blank"><span>↗</span> ওয়েবসাইট দেখুন</Link>
        <div className="admin-user">
          <div className="admin-user-avatar">{(user.email?.[0]??'A').toUpperCase()}</div>
          <div><strong>{roleNames[role]}</strong><small>{user.email}</small></div>
        </div>
        <form action={logout}><button className="admin-logout" type="submit">লগআউট</button></form>
      </div>
    </aside>

    <div className="admin-main">
      <header className="admin-topbar">
        <div><span className="admin-topbar-kicker">কন্টেন্ট ম্যানেজমেন্ট</span><strong>সহজে সম্পাদনা ও প্রকাশ করুন</strong></div>
        <div className="admin-topbar-actions"><Link href="/" target="_blank">সাইট দেখুন ↗</Link><Link className="admin-topbar-primary" href="/admin/content/new">＋ নতুন</Link></div>
      </header>
      <div className="admin-content">{children}</div>
    </div>
  </div>;
}
