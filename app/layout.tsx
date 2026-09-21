import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'আমার কুমিল্লা এক', template: '%s | আমার কুমিল্লা এক' },
  description: 'দাউদকান্দি ও মেঘনার এলাকা পরিচিতি, প্রকাশিত সংবাদ ও সাংগঠনিক তথ্য।',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="bn"><body>
    <div className="preview">প্রস্তুতিমূলক সংস্করণ · তথ্য যাচাই ও প্রকাশের কাজ চলছে</div>
    <header><Link className="brand" href="/">আমার কুমিল্লা এক<span>দাউদকান্দি — মেঘনা</span></Link>
      <nav aria-label="প্রধান মেনু"><Link href="/">হোম</Link><Link href="/about">পরিচিতি</Link><Link href="/areas">এলাকা</Link><Link href="/news">সংবাদ</Link><Link href="/sections/event">কর্মসূচি</Link><Link href="/contact">যোগাযোগ</Link></nav>
    </header>
    <main id="main">{children}</main>
    <footer><strong>আমার কুমিল্লা এক</strong><p>বাংলাদেশ জামায়াতে ইসলামী · কুমিল্লা-১ এলাকার প্রস্তাবিত ওয়েবসাইট</p><nav aria-label="অন্যান্য বিভাগ"><Link href="/sections/leader">নেতৃত্ব</Link><Link href="/sections/gallery">গ্যালারি</Link><Link href="/sections/document">প্রকাশনা</Link><Link href="/sections/archive">নির্বাচনী আর্কাইভ</Link><Link href="/admin">Admin</Link></nav><p>এটি সরকারি সেবার ওয়েবসাইট নয়।</p></footer>
  </body></html>;
}
