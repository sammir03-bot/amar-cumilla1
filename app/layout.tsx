import type {Metadata} from 'next';
import Link from 'next/link';
import {getElectionSettings} from '../lib/election';
import './globals.css';
import './site-modern.css';

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

const menuItems=[['/','Home'],['/about','About'],['/news','News'],['/sections/event','Activities'],['/join','Join']] as const;
const allItems=[['/about','পরিচিতি'],['/profiles','প্রার্থী ও দায়িত্বশীল'],['/news','সংবাদ'],['/sections/event','কর্মসূচি'],['/areas','এলাকা'],['/election','নির্বাচন ফলাফল'],['/join','যোগদানের আগ্রহ'],['/report-problem','সমস্যা জানান'],['/feedback','মতামত/পরামর্শ'],['/sections/gallery','গ্যালারি'],['/contact','যোগাযোগ'],['/privacy','গোপনীয়তা নীতি']] as const;

export default async function Layout({children}:{children:React.ReactNode}){
  let electionLive=false;
  try{const settings=await getElectionSettings();electionLive=!!settings?.live_mode&&!!settings?.public_enabled;}catch{/* Keep the site available if the election module is temporarily unavailable. */}
  return <html lang="bn"><body>
    {electionLive&&<Link className="global-election-live" href="/election"><span><i/> LIVE</span><strong>দাউদকান্দি–মেঘনা ইউনিয়ন নির্বাচন ফলাফল</strong><b>ফলাফল দেখুন →</b></Link>}
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand brand-logo-only" href="/" aria-label="Amar Cumilla–1 — Home"><img src="/logo.svg" alt="Amar Cumilla–1" width="88" height="88"/></Link>
        <nav className="desktop-nav demo-nav" aria-label="Primary navigation">{menuItems.map(([href,label],i)=><Link className={i===0?'active':''} href={href} key={href}>{label}</Link>)}</nav>
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
