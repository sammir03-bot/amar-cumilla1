import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';

const siteUrl='https://amar-cumilla1.vercel.app';

export const metadata: Metadata = {
  metadataBase:new URL(siteUrl),
  title:{default:'আমার কুমিল্লা এক',template:'%s | আমার কুমিল্লা এক'},
  description:'দাউদকান্দি ও মেঘনার এলাকা পরিচিতি, প্রকাশিত সংবাদ, কর্মসূচি ও সাংগঠনিক তথ্য।',
  alternates:{canonical:'/'},
  robots:{
    index:true,
    follow:true,
    googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1},
  },
  verification:process.env.GOOGLE_SITE_VERIFICATION?{google:process.env.GOOGLE_SITE_VERIFICATION}:undefined,
  openGraph:{
    type:'website',
    locale:'bn_BD',
    url:siteUrl,
    siteName:'আমার কুমিল্লা এক',
    title:'আমার কুমিল্লা এক',
    description:'দাউদকান্দি ও মেঘনার এলাকা পরিচিতি, প্রকাশিত সংবাদ, কর্মসূচি ও সাংগঠনিক তথ্য।',
    images:[{url:'/logo.svg',width:512,height:512,alt:'আমার কুমিল্লা এক'}],
  },
};

const navItems=[
  ['/','হোম'],
  ['/about','পরিচিতি'],
  ['/areas','এলাকা'],
  ['/news','সংবাদ'],
  ['/sections/event','কর্মসূচি'],
  ['/contact','যোগাযোগ'],
] as const;

function BrandLogo({size=46}:{size?:number}){
  return <img src="/logo.svg" alt="" width={size} height={size} style={{display:'block',width:size,height:size,borderRadius:'50%',objectFit:'cover',boxShadow:'0 8px 22px rgba(7,63,52,.20)',flexShrink:0}}/>;
}

function NavLinks(){
  return <>{navItems.map(([href,label])=><Link href={href} key={href}>{label}</Link>)}</>;
}

export default function Layout({children}:{children:React.ReactNode}){
  return <html lang="bn"><body>
    <div className="preview"><span>প্রস্তুতিমূলক সংস্করণ</span><i/> তথ্য যাচাই ও প্রকাশের কাজ চলছে</div>

    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="আমার কুমিল্লা এক — হোম">
          <BrandLogo/>
          <span className="brand-copy"><strong>আমার কুমিল্লা এক</strong><small>দাউদকান্দি — মেঘনা</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="প্রধান মেনু"><NavLinks/></nav>
        <details className="mobile-nav">
          <summary>মেনু <span aria-hidden="true">☰</span></summary>
          <nav aria-label="মোবাইল মেনু"><NavLinks/></nav>
        </details>
      </div>
    </header>

    <main id="main">{children}</main>

    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <BrandLogo/>
          <div><strong>আমার কুমিল্লা এক</strong><p>কুমিল্লা–১ · দাউদকান্দি — মেঘনা</p></div>
        </div>
        <div className="footer-block"><span>তথ্য</span><nav aria-label="তথ্য বিভাগ"><Link href="/areas">এলাকা</Link><Link href="/news">সংবাদ</Link><Link href="/sections/event">কর্মসূচি</Link><Link href="/sections/document">প্রকাশনা</Link></nav></div>
        <div className="footer-block"><span>সংগঠন</span><nav aria-label="সংগঠন বিভাগ"><Link href="/about">পরিচিতি</Link><Link href="/sections/leader">নেতৃত্ব</Link><Link href="/sections/gallery">গ্যালারি</Link><Link href="/contact">যোগাযোগ</Link></nav></div>
      </div>
      <div className="footer-bottom"><p>বাংলাদেশ জামায়াতে ইসলামী · কুমিল্লা-১ এলাকার প্রস্তাবিত ওয়েবসাইট</p><div><span>এটি সরকারি সেবার ওয়েবসাইট নয়</span><Link href="/admin">Admin</Link></div></div>
    </footer>
  </body></html>;
}
