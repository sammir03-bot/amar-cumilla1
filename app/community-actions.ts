'use server';
import {z} from 'zod';
import {redirect} from 'next/navigation';
import {publicDb} from '../lib/supabase';

const clean=(f:FormData,key:string)=>String(f.get(key)??'').trim();
const schema=z.object({
  type:z.enum(['join','problem','feedback']),
  full_name:z.string().min(2).max(120),
  phone:z.string().max(40),
  email:z.string().email().max(180).or(z.literal('')),
  upazila:z.enum(['daudkandi','meghna']),
  union_name:z.string().max(160),
  subject:z.string().max(220),
  message:z.string().min(3).max(6000),
  consent:z.literal(true),
}).superRefine((value,ctx)=>{
  if(value.type==='join'&&value.phone.replace(/\D/g,'').length<6){
    ctx.addIssue({code:z.ZodIssueCode.custom,path:['phone'],message:'যোগাযোগের ফোন নম্বর দিন'});
  }
});

const successPath:Record<'join'|'problem'|'feedback',string>={join:'/join?sent=1',problem:'/report-problem?sent=1',feedback:'/feedback?sent=1'};
const errorPath:Record<'join'|'problem'|'feedback',string>={join:'/join?error=1',problem:'/report-problem?error=1',feedback:'/feedback?error=1'};

export async function submitCommunityForm(formData:FormData){
  const rawType=clean(formData,'type');
  const type=(['join','problem','feedback'].includes(rawType)?rawType:'feedback') as 'join'|'problem'|'feedback';

  // Honeypot: bots often fill hidden website fields. Return a normal success page without storing it.
  if(clean(formData,'website'))redirect(successPath[type]);

  const parsed=schema.safeParse({
    type,
    full_name:clean(formData,'full_name'),
    phone:clean(formData,'phone'),
    email:clean(formData,'email'),
    upazila:clean(formData,'upazila'),
    union_name:clean(formData,'union_name'),
    subject:clean(formData,'subject'),
    message:clean(formData,'message'),
    consent:formData.get('consent')==='on',
  });
  if(!parsed.success)redirect(errorPath[type]);

  const {error}=await publicDb().from('cumilla_submissions').insert({...parsed.data,status:'new'});
  if(error)redirect(errorPath[type]);
  redirect(successPath[type]);
}
