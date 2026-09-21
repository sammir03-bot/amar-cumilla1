import {notFound} from 'next/navigation';
import {getPost} from '../../../lib/content';
import {PostView} from '../../../components/posts';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const p=await getPost((await params).slug);return {title:p?.title??'প্রকাশনা পাওয়া যায়নি'};}
export default async function Post({params}:{params:Promise<{slug:string}>}){const p=await getPost((await params).slug);if(!p)notFound();return <section><PostView post={p}/></section>;}
