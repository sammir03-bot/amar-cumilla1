import {requireStaff} from '../../lib/supabase';
import AdminShell from '../../components/admin-shell';
import './admin.css';
import './admin-fixes.css';
import './studio.css';
import './profile-mobile-fix.css';
export const metadata={title:'সম্পাদনা কেন্দ্র',robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){const {role,user}=await requireStaff();return <AdminShell role={role} email={user.email??''}>{children}</AdminShell>;}
