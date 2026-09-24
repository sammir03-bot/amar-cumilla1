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
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
  verification:process.env.GOOGLE_SITE_VERIFICATION?{google:process.env.GOOGLE_SITE_VERIFICATION}:undefined,
  openGraph:{type:'website',locale:'bn_BD',url:siteUrl,siteName:'Amar Cumilla–1',title:'Amar Cumilla–1',description:'দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ, নেতৃত্ব, কর্মসূচি ও স্থানীয় তথ্য।',images:[{url:'/home-hero-image',width:1600,height:900,alt:'Amar Cumilla–1'}]},
};

const menuItems=[
  ['/','Home','home','হোম'],
  ['/about','About','',''],
  ['/news','News','news','খবর'],
  ['/sections/event','Activities','',''],
  ['/join','Join','join','যোগ দিন']
] as const;
const allItems=[['/','হোম'],['/about','পরিচিতি'],['/profiles','প্রার্থী ও দায়িত্বশীল'],['/news','সংবাদ'],['/search','সাইটে খুঁজুন'],['/sections/event','কর্মসূচি'],['/areas','এলাকা'],['/election','নির্বাচন ফলাফল'],['/join','যোগদানের আগ্রহ'],['/report-problem','সমস্যা জানান'],['/feedback','মতামত/পরামর্শ'],['/sections/gallery','গ্যালারি'],['/editorial-policy','সম্পাদকীয় ও তথ্য যাচাই নীতি'],['/contact','যোগাযোগ'],['/privacy','গোপনীয়তা নীতি']] as const;

function NavIcon({name}:{name:string}){
  if(!name)return null;
  const common={className:`nav-mini-icon nav-mini-icon-${name}`,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,'aria-hidden':true};
  if(name==='home')return <svg {...common}><path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9 20v-5.5h6V20"/></svg>;
  if(name==='news')return <svg {...common}><rect x="4.5" y="4.5" width="13" height="15" rx="1.5"/><path d="M8.5 8h5.5M8.5 11.5H14M8.5 15h4"/><path d="M17.5 7.5H20v9.25A2.25 2.25 0 0 1 17.75 19H17.5"/></svg>;
  return <svg {...common}><circle cx="9" cy="8" r="3.5"/><path d="M3.5 20c0-3.4 2.4-5.8 5.5-5.8s5.5 2.4 5.5 5.8"/><path d="M18.5 7v6M15.5 10h6"/></svg>;
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
        <Link className="brand brand-logo-only" href="/" aria-label="Amar Cumilla–1 — Home">
          <img src="/logo.svg" alt="Amar Cumilla–1" width="88" height="88"/>
          <span className="brand-title"><strong>Amar Cumilla–1</strong><small>Daudkandi · Meghna</small></span>
        </Link>
        <nav className="desktop-nav demo-nav" aria-label="Primary navigation">{menuItems.map(([href,label,icon,mobileLabel],i)=><Link aria-label={icon?label:undefined} className={`${i===0?'active ':''}${icon?'nav-link-with-icon':''}`.trim()} href={href} key={href}><NavIcon name={icon}/><span className="nav-label-desktop">{label}</span>{mobileLabel&&<span className="nav-label-mobile">{mobileLabel}</span>}</Link>)}</nav>
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
        <div className="footer-links"><div><span>তথ্য</span><Link href="/news">সংবাদ</Link><Link href="/search">সাইটে খুঁজুন</Link><Link href="/profiles">প্রার্থী ও দায়িত্বশীল</Link><Link href="/areas">এলাকা</Link><Link href="/election">নির্বাচন ফলাফল</Link></div><div><span>অংশগ্রহণ</span><Link href="/join">যোগদানের আগ্রহ</Link><Link href="/report-problem">সমস্যা জানান</Link><Link href="/feedback">মতামত দিন</Link></div><div><span>আরও</span><Link href="/sections/gallery">গ্যালারি</Link><Link href="/editorial-policy">সম্পাদকীয় ও তথ্য যাচাই নীতি</Link><Link href="/contact">যোগাযোগ</Link><Link href="/privacy">গোপনীয়তা নীতি</Link></div></div>
      </div>
      <div className="footer-bottom"><span>Daudkandi &amp; Meghna · Cumilla–1</span><p>এটি সরকারি ওয়েবসাইট নয় · উৎসভিত্তিক তথ্য প্রকাশ করা হয় · <Link href="/editorial-policy">Editorial Policy</Link> · <Link href="/privacy">Privacy Policy</Link></p></div>
    </footer>
  </body></html>;
}
