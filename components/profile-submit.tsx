'use client';
import {useFormStatus} from 'react-dom';
import type {ProfileStatus} from '../lib/profile-rules';
export default function ProfileSubmit({status,canPublish}:{status:ProfileStatus;canPublish:boolean}){
 const {pending,data}=useFormStatus();
 return <div className="profile-submit-buttons"><button type="submit" name="intent" value="save" disabled={pending} className="profile-save-draft">{pending&&data?.get('intent')==='save'?'সংরক্ষণ হচ্ছে…':status!=='draft'?'পরিবর্তন সংরক্ষণ':'খসড়া সংরক্ষণ'}</button>{canPublish&&status!=='published'&&<button type="submit" name="intent" value="publish" disabled={pending}>{pending&&data?.get('intent')==='publish'?'প্রকাশ হচ্ছে…':'প্রকাশ করুন'}</button>}{canPublish&&status==='published'&&<button type="submit" name="intent" value="draft" disabled={pending} className="profile-save-draft">খসড়ায় নিন</button>}</div>;
}

export function ProfileArchive(){const {pending}=useFormStatus();return <button type="submit" name="intent" value="archive" disabled={pending} className="admin-btn profile-archive">আর্কাইভে রাখুন</button>;}
