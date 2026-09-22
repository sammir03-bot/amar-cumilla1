import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import './site-modern.css';

const siteUrl='https://amar-cumilla1.vercel.app';

export const metadata: Metadata = {
  metadataBase:new URL(siteUrl),
  title:{default:'আমার কুমিল্লা এক',template:'%s | আমার কুমিল্লা এক'},
  description:'বাংলাদেশ জামায়াতে ইসলামী কুমিল্লা-১ এলাকার দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ, নেতৃত্ব, কর্মসূচি, এলাকা পরিচিতি ও স্থানীয় তথ্য।',
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
    description:'বাংলাদেশ জামায়াতে ইসলামী কুমিল্লা-১ এলাকার দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ, নেতৃত্ব, কর্মসূচি ও স্থানীয় তথ্য।',
    images:[{url:'/logo.svg',width:512,height:512,alt:'আমার কুমিল্লা এক'}],
  },
};

const navItems=[
  ['/','হোম'],
  ['/about','পরিচিতি'],
  ['/sections/leader','নেতৃত্ব'],
  ['/news','সংবাদ'],
  ['/sections/event','কর্মসূচি'],
  ['/areas','এলাকা'],
  ['/sections/gallery','গ্যালারি'],
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
    <div className="preview"><span>বাংলাদেশ জামায়াতে ইসলামী · কুমিল্লা-১</span><i/> দাউদকান্দি — মেঘনা তথ্য ও কার্যক্রম</div>

    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="আমার কুমিল্লা এক — হোম">
          <BrandLogo/>
          <span className="brand-copy"><strong>আমার কুমিল্লা এক</strong><small>কুমিল্লা–১ · দাউদকান্দি — মেঘনা</small></span>
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
          <div><strong>আমার কুমিল্লা এক</strong><p>বাংলাদেশ জামায়াতে ইসলামী · কুমিল্লা–১</p></div>
        </div>
        <div className="footer-block"><span>তথ্য</span><nav aria-label="তথ্য বিভাগ"><Link href="/areas">এলাকা</Link><Link href="/news">সংবাদ</Link><Link href="/sections/event">কর্মসূচি</Link><Link href="/sections/document">প্রকাশনা</Link><Link href="/sections/archive">আর্কাইভ</Link></nav></div>
        <div className="footer-block"><span>সংগঠন</span><nav aria-label="সংগঠন বিভাগ"><Link href="/about">পরিচিতি</Link><Link href="/sections/leader">নেতৃত্ব</Link><Link href="/sections/gallery">গ্যালারি</Link><Link href="/contact">যোগাযোগ</Link></nav></div>
      </div>
      <div className="footer-bottom"><p>কুমিল্লা-১ এলাকার দলীয় তথ্য ও কার্যক্রমের ওয়েবসাইট</p><div><span>এটি সরকারি ওয়েবসাইট নয় · উৎসভিত্তিক তথ্য প্রকাশ করা হয়</span><Link href="/admin">Admin</Link></div></div>
    </footer>
  </body></html>;
}
