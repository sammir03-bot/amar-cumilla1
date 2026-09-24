'use client';
import {useContext,useEffect,useRef,useState} from 'react';
import {FormChangeContext} from './action-form';
import {MAX_MEDIA_BYTES} from '../lib/upload-types';
import type {PhotoMode} from '../lib/profile-rules';

export default function ProfilePhotoEditor({image,external}:{image:string|null;external:string|null}){
 const [mode,setMode]=useState<PhotoMode>('keep'),[file,setFile]=useState<File|null>(null),[preview,setPreview]=useState<string|null>(null),[error,setError]=useState('');
 const input=useRef<HTMLInputElement>(null),changed=useContext(FormChangeContext);
 useEffect(()=>{if(!file){setPreview(null);return;}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url);},[file]);
 function choose(value:PhotoMode){setMode(value);setError('');if(value!=='upload'){setFile(null);if(input.current)input.current.value='';}changed();}
 const display=mode==='none'||mode==='external'?null:mode==='upload'?preview:image;
 return <section className="admin-form-section" id="profile-photo"><div className="admin-form-section-head"><div><h2>প্রোফাইল ছবি</h2><p>যে ছবি নির্বাচন করবেন, হোম ও বিস্তারিত পরিচিতিতে সেটিই থাকবে।</p></div></div>
  <div className="profile-photo-layout"><div className="profile-photo-preview">{display?<img src={display} alt={mode==='upload'?'নির্বাচিত নতুন ছবি':'বর্তমান প্রোফাইল ছবি'}/>:<span>ছবি নির্বাচন করুন</span>}</div><div>
   <input type="hidden" name="photo_mode" value={mode}/>
   <label className="profile-upload">{image?'ছবি বদলান':'ছবি আপলোড করুন'}<input ref={input} type="file" name="photo_file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const selected=e.target.files?.[0];if(!selected)return;if(selected.size>MAX_MEDIA_BYTES){setError('৮ MB-এর মধ্যে ছবি নির্বাচন করুন।');e.target.value='';return;}setFile(selected);setMode('upload');setError('');changed();}}/><span className="admin-help">JPG, PNG বা WebP · সর্বোচ্চ ৮ MB</span></label>
   {file&&mode==='upload'&&<p className="profile-file-name">{file.name}</p>}
   <div className="profile-photo-options">{image&&<button type="button" onClick={()=>choose('keep')} aria-pressed={mode==='keep'}>বর্তমান ছবি রাখুন</button>}<button type="button" onClick={()=>choose('none')} aria-pressed={mode==='none'}>ছবি সরান</button><button type="button" onClick={()=>choose('external')} aria-pressed={mode==='external'}>লিংক থেকে ছবি</button></div>
   <label hidden={mode!=='external'}>ছবির পূর্ণ লিংক<input type="url" name="photo_url" defaultValue={external??''} disabled={mode!=='external'} placeholder="https://..." required={mode==='external'}/></label>
   {error&&<p className="studio-media-error" role="alert">{error}</p>}
  </div></div>
 </section>;
}
