'use client';
import Link from 'next/link';
import Form from 'next/form';
import {usePathname} from 'next/navigation';
import {useEffect,useRef} from 'react';
import {logout} from '../app/login/actions';
import Icon from './admin-icon';
const links=[
 {href:'/admin',label:'ড্যাশবোর্ড',icon:'grid'},
 {href:'/admin/content',label:'সব কনটেন্ট',icon:'file'},
 {href:'/admin/quality',label:'মান যাচাই',icon:'check'},
 {href:'/admin/profiles',label:'প্রার্থী ও দায়িত্বশীল',icon:'users'},
 {href:'/admin/media',label:'মিডিয়া লাইব্রেরি',icon:'image'},
 {href:'/admin/submissions',label:'ফর্ম ইনবক্স',icon:'inbox'},
 {href:'/admin/election',label:'নির্বাচন ও ফলাফল',icon:'chart'},
 {href:'/admin/areas',label:'এলাকার তথ্য',icon:'pin',admin:true},
 {href:'/admin/audit',label:'পরিবর্তনের ইতিহাস',icon:'history',admin:true}
];
const roles={admin:'অ্যাডমিন',publisher:'প্রকাশক',editor:'সম্পাদক'};
export default function AdminShell({children,role,email}:{children:React.ReactNode;role:keyof typeof roles;email:string}){
 const pathname=usePathname(),drawer=useRef<HTMLDialogElement>(null),search=useRef<HTMLInputElement>(null);
 const profiles=pathname.startsWith('/admin/profiles');
 const createHref=profiles?'/admin/profiles/new':'/admin/content/new';
 const createLabel=profiles?'নতুন পরিচিতি':'নতুন প্রকাশনা';
 const active=links.find(l=>l.href==='/admin'?pathname===l.href:pathname.startsWith(l.href));
 useEffect(()=>{drawer.current?.close();},[pathname]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();search.current?.focus();}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[]);
 const navigation=<><Link href="/admin" className="studio-brand"><img src="/logo.svg" alt="" width="44" height="44"/><span><strong>আমার কুমিল্লা এক</strong><small>সম্পাদনা কেন্দ্র</small></span></Link><Link className="studio-create" href={createHref}><Icon name="plus"/>{createLabel}</Link><p className="studio-nav-label">কাজের জায়গা</p><nav aria-label="অ্যাডমিন মেনু" className="studio-nav">{links.filter(l=>!l.admin||role==='admin').map(l=><Link key={l.href} href={l.href} aria-current={active?.href===l.href?'page':undefined}><Icon name={l.icon}/><span>{l.label}</span>{active?.href===l.href&&<span className="studio-active-mark"/>}</Link>)}</nav><div className="studio-sidebar-bottom"><Link href="/" target="_blank" className="studio-visit"><Icon name="external"/>ওয়েবসাইট দেখুন</Link><div className="studio-account"><span className="studio-avatar">{email[0]?.toUpperCase()??'A'}</span><span><strong>{roles[role]}</strong><small>{email}</small></span><form action={logout}><button className="studio-icon-button" title="লগআউট" aria-label="লগআউট"><Icon name="logout" size={18}/></button></form></div></div></>;
 return <div className="admin-app studio-app"><a className="studio-skip" href="#admin-workspace">মূল কাজে যান</a><aside className="studio-sidebar">{navigation}</aside><dialog ref={drawer} className="studio-drawer" aria-label="অ্যাডমিন মেনু"><button type="button" className="studio-drawer-close studio-icon-button" aria-label="মেনু বন্ধ করুন" onClick={()=>drawer.current?.close()}><Icon name="close"/></button>{navigation}</dialog><div className="studio-main"><header className="studio-topbar"><div className="studio-breadcrumb"><button type="button" className="studio-mobile-menu studio-icon-button" aria-label="মেনু খুলুন" onClick={()=>drawer.current?.showModal()}><Icon name="menu"/></button><span>ওয়ার্কস্পেস</span><span className="studio-slash">/</span><strong>{active?.label??'সম্পাদনা'}</strong></div><Form key={profiles?'profiles':'content'} action={profiles?'/admin/profiles':'/admin/content'} className="studio-search" role="search"><Icon name="search" size={18}/><input ref={search} name="q" placeholder={profiles?'পরিচিতির নাম খুঁজুন…':'প্রকাশনা খুঁজুন…'} aria-label={profiles?'সব পরিচিতিতে খুঁজুন':'সব প্রকাশনায় খুঁজুন'}/><kbd>⌘ K</kbd></Form><Link href={createHref} className="studio-top-create" aria-label={createLabel}><Icon name="plus"/></Link></header><div className="admin-content studio-content" id="admin-workspace">{children}</div><nav className="studio-mobile-nav" aria-label="দ্রুত মেনু">{links.slice(0,4).map(l=><Link key={l.href} href={l.href} aria-current={active?.href===l.href?'page':undefined}><Icon name={l.icon}/><span>{l.href==='/admin/content'?'কনটেন্ট':l.href==='/admin/quality'?'মান':l.href==='/admin/profiles'?'পরিচিতি':l.label}</span></Link>)}<button type="button" onClick={()=>drawer.current?.showModal()}><Icon name="menu"/><span>আরও</span></button></nav></div></div>;
}
