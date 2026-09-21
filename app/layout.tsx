import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';

const logoSrc = 'data:image/webp;base64,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';

export const metadata: Metadata = {
  title: {default: 'আমার কুমিল্লা এক', template: '%s | আমার কুমিল্লা এক'},
  description: 'দাউদকান্দি ও মেঘনার এলাকা পরিচিতি, প্রকাশিত সংবাদ, কর্মসূচি ও সাংগঠনিক তথ্য।',
  robots: {index: false, follow: false},
};

const navItems = [
  ['/', 'হোম'],
  ['/about', 'পরিচিতি'],
  ['/areas', 'এলাকা'],
  ['/news', 'সংবাদ'],
  ['/sections/event', 'কর্মসূচি'],
  ['/contact', 'যোগাযোগ'],
] as const;

function BrandLogo({size = 46}: {size?: number}) {
  return <img
    src={logoSrc}
    alt=""
    width={size}
    height={size}
    style={{display:'block',width:size,height:size,borderRadius:'50%',objectFit:'cover',boxShadow:'0 8px 22px rgba(7,63,52,.20)',flexShrink:0}}
  />;
}

function NavLinks() {
  return <>{navItems.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</>;
}

export default function Layout({children}: {children: React.ReactNode}) {
  return <html lang="bn"><body>
    <div className="preview"><span>প্রস্তুতিমূলক সংস্করণ</span><i /> তথ্য যাচাই ও প্রকাশের কাজ চলছে</div>

    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="আমার কুমিল্লা এক — হোম">
          <BrandLogo />
          <span className="brand-copy"><strong>আমার কুমিল্লা এক</strong><small>দাউদকান্দি — মেঘনা</small></span>
        </Link>

        <nav className="desktop-nav" aria-label="প্রধান মেনু"><NavLinks /></nav>

        <details className="mobile-nav">
          <summary>মেনু <span aria-hidden="true">☰</span></summary>
          <nav aria-label="মোবাইল মেনু"><NavLinks /></nav>
        </details>
      </div>
    </header>

    <main id="main">{children}</main>

    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <BrandLogo />
          <div><strong>আমার কুমিল্লা এক</strong><p>কুমিল্লা–১ · দাউদকান্দি — মেঘনা</p></div>
        </div>
        <div className="footer-block"><span>তথ্য</span><nav aria-label="তথ্য বিভাগ"><Link href="/areas">এলাকা</Link><Link href="/news">সংবাদ</Link><Link href="/sections/event">কর্মসূচি</Link><Link href="/sections/document">প্রকাশনা</Link></nav></div>
        <div className="footer-block"><span>সংগঠন</span><nav aria-label="সংগঠন বিভাগ"><Link href="/about">পরিচিতি</Link><Link href="/sections/leader">নেতৃত্ব</Link><Link href="/sections/gallery">গ্যালারি</Link><Link href="/contact">যোগাযোগ</Link></nav></div>
      </div>
      <div className="footer-bottom"><p>বাংলাদেশ জামায়াতে ইসলামী · কুমিল্লা-১ এলাকার প্রস্তাবিত ওয়েবসাইট</p><div><span>এটি সরকারি সেবার ওয়েবসাইট নয়</span><Link href="/admin">Admin</Link></div></div>
    </footer>
  </body></html>;
}
