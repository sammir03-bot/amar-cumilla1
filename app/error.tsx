'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <section><h1>তথ্য লোড করা যায়নি</h1><p>সংযোগে সমস্যা হয়েছে। আপনার তথ্য মুছে যায়নি।</p><button onClick={reset}>আবার চেষ্টা করুন</button></section>;}
