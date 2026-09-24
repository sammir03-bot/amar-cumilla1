import type {Metadata} from 'next';
import Link from 'next/link';
import {Suspense} from 'react';
import {getElectionSettings} from '../lib/election';
import './globals.css';
import './site-modern.css';
import './nav-icons.css';

const siteUrl='https://amar-cumilla1.vercel.app';
export const dynamic='force-dynamic';

export const metadata:Metadata={
  metadataBase:new URL(siteUrl),
  title:{default:'Amar Cumilla–1',template:'%s | Amar Cumilla–1'},
  description:'দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ, নেতৃত্ব, কর্মসূচি, এলাকা পরিচিতি ও স্থানীয় তথ্য।',
  alternates:{canonical:'/'},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
  verification:process.env.GOOGLE_SITE_VERIFICATION?{google:process.env.GOOGLE_SITE_VERIFICATION}:undefined,
  openGraph:{type:'website',locale:'bn_BD',url:siteUrl,siteName:'Amar Cumilla–1',title:'Amar Cumilla–1',description:'দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ, নেতৃত্ব, কর্মসূচি ও স্থানীয় তথ্য।',images:[{url:'/home-hero-image',width:1600,height:900,alt:'Amar Cumilla–1'}]},
};

const menuItems=[['/','Home','home'],['/about','About',''],['/news','News','news'],['/sections/event','Activities',''],['/join','Join','join']] as const;
const allItems=[['/about','পরিচিতি'],['/profiles','প্রার্থী ও দায়িত্বশীল'],['/news','সংবাদ'],['/sections/event','কর্মসূচি'],['/areas','এলাকা'],['/election','নির্বাচন ফলাফল'],['/join','যোগদানের আগ্রহ'],['/report-problem','সমস্যা জানান'],['/feedback','মতামত/পরামর্শ'],['/sections/gallery','গ্যালারি'],['/contact','যোগাযোগ'],['/privacy','গোপনীয়তা নীতি']] as const;

function NavIcon({name}:{name:string}){
  if(!name)return null;
  const paths:Record<string,string>={
    home:'M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z',
    news:'M4 5h12v14H4z M8 9h4 M8 13h4 M8 17h4 M16 8h4v9a2 2 0 0 1-2 2h-2',
    join:'M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M18 8v6 M15 11h6'
  };
  return <svg className="nav-mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>;
}

async function ElectionBanner(){
  let electionLive=false;
  try{const settings=await getElectionSettings();electionLive=!!settings?.live_mode&&!!settings?.public_enabled;}catch{/* Keep the site available if the election module is temporarily unavailable. */}
  return electionLive?<Link className="global-election-live" href="/election"><span><i/> LIVE</span><strong>দাউদকান্দি–মেঘনা ইউনিয়ন নির্বাচন ফলাফল</strong><b>ফলাফল দেখুন →</b></Link>:null;
}
export default function Layout({children}:{children:React.ReactNode}){
  return <html lang="bn"><body>
    <Suspense fallback={null}><ElectionBanner/></Suspense>
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand brand-logo-only" href="/" aria-label="Amar Cumilla–1 — Home"><img src="/logo.svg" alt="Amar Cumilla–1" width="88" height="88"/></Link>
        <nav className="desktop-nav demo-nav" aria-label="Primary navigation">{menuItems.map(([href,label,icon],i)=><Link className={`${i===0?'active ':''}${icon?'nav-link-with-icon':''}`.trim()} href={href} key={href}><NavIcon name={icon}/><span>{label}</span></Link>)}</nav>
        <details className="mobile-nav demo-menu">
          <summary><span className="menu-bars" aria-hidden="true"><i/><i/><i/></span><b>MENU</b></summary>
          <nav>{allItems.map(([href,label])=><Link href={href} key={href}>{label}</Link>)}</nav>
        </details>
      </div>
    </header>

    <main id="main">{children}</main>

    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand"><img src="/logo.svg" alt="" width="58" height="58"/><div><strong>Amar Cumilla–1</strong><p>দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ, নেতৃত্ব, কার্যক্রম ও স্থানীয় তথ্য।</p></div></div>
        <div className="footer-links"><div><span>তথ্য</span><Link href="/news">সংবাদ</Link><Link href="/profiles">প্রার্থী ও দায়িত্বশীল</Link><Link href="/areas">এলাকা</Link><Link href="/election">নির্বাচন ফলাফল</Link></div><div><span>অংশগ্রহণ</span><Link href="/join">যোগদানের আগ্রহ</Link><Link href="/report-problem">সমস্যা জানান</Link><Link href="/feedback">মতামত দিন</Link></div><div><span>আরও</span><Link href="/sections/gallery">গ্যালারি</Link><Link href="/contact">যোগাযোগ</Link><Link href="/privacy">গোপনীয়তা নীতি</Link></div></div>
      </div>
      <div className="footer-bottom"><span>Daudkandi &amp; Meghna · Cumilla–1</span><p>এটি সরকারি ওয়েবসাইট নয় · উৎসভিত্তিক তথ্য প্রকাশ করা হয় · <Link href="/privacy">Privacy Policy</Link></p></div>
    </footer>
  </body></html>;
}
