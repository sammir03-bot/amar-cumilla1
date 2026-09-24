'use client';
import {useActionState} from 'react';
import {setProfileStatus} from '../app/admin/profile-actions';
export default function ProfileStatusAction({id,version,status,featured}:{id:string;version:string;status:string;featured:boolean}){
 const [state,action,pending]=useActionState(setProfileStatus,{});
 const next=status==='published'?'draft':'published';
 return <form action={action} className="profile-quick-action"><input type="hidden" name="id" value={id}/><input type="hidden" name="version" value={version}/><input type="hidden" name="next_status" value={next}/><button disabled={pending} className={status==='published'?'admin-btn':'admin-btn primary'}>{pending?'সংরক্ষণ হচ্ছে…':status==='published'?'খসড়ায় নিন':'প্রকাশ করুন'}</button>{state.error&&<p role="alert">{state.error}</p>}{state.success&&<p role="status">{status==='published'&&!featured?'প্রকাশিত; হোমে দেখাতে সম্পাদনা থেকে হোমপেজ চালু করুন।':state.success}</p>}</form>;
}
