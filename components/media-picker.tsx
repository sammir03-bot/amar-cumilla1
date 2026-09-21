'use client';

import {useRef,useState} from 'react';
import styles from './media-picker.module.css';

type Picked={name:string;url?:string;type:string;size:number};

function sizeLabel(bytes:number){
  if(bytes<1024*1024)return `${Math.max(1,Math.round(bytes/1024))} KB`;
  return `${(bytes/1024/1024).toFixed(1)} MB`;
}

export default function MediaPicker({existing=[]}:{existing?:string[]}){
  const inputRef=useRef<HTMLInputElement>(null);
  const [picked,setPicked]=useState<Picked[]>([]);
  const [error,setError]=useState('');

  function choose(files:FileList|null){
    picked.forEach(item=>item.url&&URL.revokeObjectURL(item.url));
    if(!files?.length){setPicked([]);setError('');return;}
    const list=Array.from(files);
    if(list.length>4){setPicked([]);setError('একবারে সর্বোচ্চ ৪টি ফাইল নির্বাচন করুন।');if(inputRef.current)inputRef.current.value='';return;}
    const bad=list.find(file=>!['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type)||file.size>8*1024*1024);
    if(bad){setPicked([]);setError('JPG, PNG, WebP বা PDF দিন। প্রতিটি ফাইল সর্বোচ্চ ৮ MB।');if(inputRef.current)inputRef.current.value='';return;}
    const total=list.reduce((sum,file)=>sum+file.size,0);
    if(total>20*1024*1024){setPicked([]);setError('নির্বাচিত ফাইলগুলোর মোট আকার ২০ MB-এর মধ্যে রাখুন।');if(inputRef.current)inputRef.current.value='';return;}
    setError('');
    setPicked(list.map(file=>({name:file.name,type:file.type,size:file.size,url:file.type.startsWith('image/')?URL.createObjectURL(file):undefined})));
  }

  function clear(){
    picked.forEach(item=>item.url&&URL.revokeObjectURL(item.url));
    setPicked([]);setError('');
    if(inputRef.current)inputRef.current.value='';
  }

  return <div className={styles.wrap}>
    {existing.length>0&&<div className={styles.existing}>
      <div className={styles.existingHead}><strong>আগের ফাইল</strong><span>যেগুলো রাখতে চান টিক রাখা থাকুক</span></div>
      <div className={styles.existingList}>{existing.map((path,index)=><label className={styles.existingItem} key={path}>
        <input type="checkbox" name="keep_media_paths" value={path} defaultChecked/>
        <span><strong>ফাইল {index+1}</strong><small>{path.split('/').pop()}</small></span>
      </label>)}</div>
    </div>}

    <label className={styles.dropzone}>
      <input ref={inputRef} className={styles.input} type="file" name="media_files" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={e=>choose(e.currentTarget.files)}/>
      <span className={styles.icon}>＋</span>
      <span className={styles.title}>ছবি বা PDF নির্বাচন করুন</span>
      <span className={styles.sub}>মোবাইলের Gallery বা Files থেকে সরাসরি নির্বাচন করতে পারবেন</span>
      <span className={styles.meta}>একবারে ৪টি · প্রতিটি সর্বোচ্চ ৮ MB · JPG, PNG, WebP, PDF</span>
    </label>

    <p className={styles.note}><span>✓</span> ফাইল নির্বাচন করলেই আপলোড হবে না। নিচের <strong>“সংরক্ষণ করুন”</strong> চাপলে লেখা ও ছবি একসাথে নিরাপদে আপলোড হবে।</p>
    {error&&<p className={styles.error} role="alert">{error}</p>}

    {picked.length>0&&<div className={styles.previewBlock}>
      <div className={styles.previewHead}><strong>{picked.length.toLocaleString('bn-BD')}টি ফাইল প্রস্তুত</strong><button type="button" onClick={clear}>নির্বাচন মুছুন</button></div>
      <div className={styles.previews}>{picked.map((item,index)=><div className={styles.preview} key={item.name+index}>
        {item.url?<img src={item.url} alt="নির্বাচিত ছবির প্রিভিউ"/>:<span className={styles.pdf}>PDF</span>}
        <div><strong>{item.name}</strong><small>{sizeLabel(item.size)}</small></div>
      </div>)}</div>
    </div>}
  </div>;
}
