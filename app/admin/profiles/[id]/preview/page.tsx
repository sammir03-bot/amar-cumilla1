import Link from 'next/link';
import {notFound} from 'next/navigation';
import {z} from 'zod';
import {requireStaff} from '../../../../../lib/supabase';
import {profilePhotos,type Profile} from '../../../../../lib/profiles';
import ProfileView from '../../../../../components/profile-view';
export default async function Preview({params}:{params:Promise<{id:string}>}){
 const [{id},{db}]=await Promise.all([params,requireStaff()]);
 if(!z.uuid().safeParse(id).success)notFound();
 const {data,error}=await db.from('cumilla_profiles').select('*').eq('id',id).maybeSingle();
 if(error)throw new Error('পরিচিতি আনা যায়নি।');
 if(!data)notFound();
 const profile=data as Profile;
 const [{image}]=await profilePhotos([profile],db);
 return <div className="profile-preview-page"><div className="admin-page-header"><div><h1>পরিচিতির প্রিভিউ</h1><p>সংরক্ষিত তথ্য দেখছেন। খসড়া প্রিভিউ শুধু অ্যাডমিনের জন্য।</p></div><Link className="admin-btn" href={'/admin/profiles/'+id}>← সম্পাদনায় ফিরুন</Link></div><ProfileView profile={profile} image={image}/></div>;
}
