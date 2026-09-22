import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import './site-modern.css';

const siteUrl='https://amar-cumilla1.vercel.app';

export const metadata:Metadata={
  metadataBase:new URL(siteUrl),
  title:{default:'আমার কুমিল্লা এক',template:'%s | আমার কুমিল্লা এক'},
  description:'বাংলাদেশ জামায়াতে ইসলামী কুমিল্লা-১ এলাকার দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ, নেতৃত্ব, কর্মসূচি, এলাকা পরিচিতি ও স্থানীয় তথ্য।',
  alternates:{canonical:'/'},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
  verification:process.env.GOOGLE_SITE_VERIFICATION?{google:process.env.GOOGLE_SITE_VERIFICATION}:undefined,
  openGraph:{type:'website',locale:'bn_BD',url:siteUrl,siteName:'আমার কুমিল্লা এক',title:'আমার কুমিল্লা এক',description:'বাংলাদেশ জামায়াতে ইসলামী কুমিল্লা-১ এলাকার দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ, নেতৃত্ব, কর্মসূচি ও স্থানীয় তথ্য।',images:[{url:'/home-hero-image',width:1600,height:900,alt:'আমার কুমিল্লা এক'}]},
};

const navItems=[
  ['/about','পরিচিতি'],['/sections/leader','নেতৃত্ব'],['/news','সংবাদ'],['/sections/event','কর্মসূচি'],['/areas','এলাকা'],['/sections/gallery','গ্যালারি'],['/contact','যোগাযোগ'],
] as const;

function NavLinks(){return <>{navItems.map(([href,label])=><Link href={href} key={href}>{label}</Link>)}</>}

export default function Layout({children}:{children:React.ReactNode}){
  return <html lang="bn"><body>
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="আমার কুমিল্লা এক — হোম">
          <img src="/logo.svg" alt="" width="64" height="64"/>
          <span><strong>আমার কুমিল্লা এক</strong><small>কুমিল্লা–১ · দাউদকান্দি — মেঘনা</small></span>
        </Link>

        <nav className="desktop-nav" aria-label="প্রধান মেনু"><NavLinks/></nav>

        <div className="header-actions">
          <Link className="header-action-dark" href="/sections/event">কার্যক্রম</Link>
          <Link className="header-action-bright" href="/news">সংবাদ ↗</Link>
          <details className="mobile-nav">
            <summary><span className="menu-bars" aria-hidden="true"><i/><i/><i/></span><b>মেনু</b></summary>
            <nav><NavLinks/></nav>
          </details>
        </div>
      </div>
    </header>

    <main id="main">{children}</main>

    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand"><img src="/logo.svg" alt="" width="58" height="58"/><div><strong>আমার কুমিল্লা এক</strong><p>দাউদকান্দি ও মেঘনার দলীয় সংবাদ, নেতৃত্ব, কার্যক্রম ও স্থানীয় তথ্য।</p></div></div>
        <div className="footer-links"><div><span>তথ্য</span><Link href="/news">সংবাদ</Link><Link href="/areas">এলাকা</Link><Link href="/sections/document">প্রকাশনা</Link></div><div><span>সংগঠন</span><Link href="/about">পরিচিতি</Link><Link href="/sections/leader">নেতৃত্ব</Link><Link href="/sections/event">কর্মসূচি</Link></div><div><span>আরও</span><Link href="/sections/gallery">গ্যালারি</Link><Link href="/contact">যোগাযোগ</Link><Link href="/admin">Admin</Link></div></div>
      </div>
      <div className="footer-bottom"><span>কুমিল্লা–১ · দাউদকান্দি — মেঘনা</span><p>এটি সরকারি ওয়েবসাইট নয় · উৎসভিত্তিক তথ্য প্রকাশ করা হয়</p></div>
    </footer>
  </body></html>;
}
