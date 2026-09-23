'use server';
import {z} from 'zod';
import {revalidatePath} from 'next/cache';
import {requireStaff} from '../../../lib/supabase';

export async function updateSubmissionStatus(formData:FormData){
  const {db,role}=await requireStaff();
  if(role==='editor')return;
  const id=String(formData.get('id')??'');
  const status=String(formData.get('status')??'');
  const parsed=z.object({id:z.string().uuid(),status:z.enum(['new','reviewing','resolved','archived'])}).safeParse({id,status});
  if(!parsed.success)return;
  await db.from('cumilla_submissions').update({status:parsed.data.status,updated_at:new Date().toISOString()}).eq('id',parsed.data.id);
  revalidatePath('/admin/submissions');
}
