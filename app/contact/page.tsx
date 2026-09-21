import {getPost} from '../../lib/content';
import {PostView} from '../../components/posts';
export const dynamic='force-dynamic';
export default async function Contact(){const p=await getPost('contact');return <section>{p?<PostView post={p}/>:<><h1>যোগাযোগ</h1><p>অনুমোদিত কার্যালয়ের ঠিকানা ও যোগাযোগের তথ্য এখানে প্রকাশ করা হবে।</p></>}</section>;}
