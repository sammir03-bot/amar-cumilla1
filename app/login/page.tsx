import Link from 'next/link';
import {login,recovery} from './actions';
import Submit from '../../components/submit';
import './login.css';

export const metadata={title:'Admin লগইন',robots:{index:false,follow:false}};

export default async function Login({searchParams}:{searchParams:Promise<{error?:string;sent?:string}>}){
  const p=await searchParams;
  const errors:Record<string,string>={credentials:'লগইন হয়নি। ইমেইল ও পাসওয়ার্ড পরীক্ষা করুন।',permission:'এই অ্যাকাউন্টে সম্পাদকীয় প্রবেশাধিকার নেই।',recovery_unavailable:'পাসওয়ার্ড পুনরুদ্ধারের ঠিকানা এখনো কনফিগার করা হয়নি।',recovery_failed:'ইমেইল পাঠানো যায়নি। একটু পরে চেষ্টা করুন।'};

  return <div className="login-shell">
    <section className="login-visual">
      <div className="login-brand"><span className="login-brand-mark">ক১</span><span><strong>আমার কুমিল্লা এক</strong><small>নিরাপদ সম্পাদনা কেন্দ্র</small></span></div>
      <div className="login-message"><span>ADMIN PANEL</span><h1>সহজে লিখুন।<br/>নিরাপদে প্রকাশ করুন।</h1><p>সংবাদ, কর্মসূচি, এলাকা ও মিডিয়া—সবকিছু একটি সহজ এবং পরিষ্কার ড্যাশবোর্ড থেকে পরিচালনা করুন।</p></div>
      <div className="login-points"><span>নিরাপদ লগইন</span><span>রোল-ভিত্তিক অনুমতি</span><span>পরিবর্তনের ইতিহাস</span></div>
    </section>

    <section className="login-panel">
      <div className="login-card">
        <p>অনুমোদিত সম্পাদকদের জন্য</p><h2>লগইন করুন</h2><p className="login-sub">আপনার অনুমোদিত ইমেইল ও পাসওয়ার্ড ব্যবহার করুন।</p>
        {p.error&&<p role="alert" className="notice">{errors[p.error]??'অনুরোধ সম্পন্ন হয়নি।'}</p>}
        {p.sent&&<p role="status" className="notice">অ্যাকাউন্টটি উপযুক্ত হলে পুনরুদ্ধারের ইমেইল পাঠানো হয়েছে।</p>}

        <form action={login}>
          <label>ইমেইল<input name="email" type="email" autoComplete="username" required maxLength={254} placeholder="name@example.com"/></label>
          <label>পাসওয়ার্ড<input name="password" type="password" autoComplete="current-password" required maxLength={200} placeholder="আপনার পাসওয়ার্ড"/></label>
          <Submit>লগইন করুন</Submit>
        </form>

        <details><summary>পাসওয়ার্ড ভুলে গেছেন?</summary><form action={recovery}><label>ইমেইল<input name="email" type="email" required maxLength={254} placeholder="name@example.com"/></label><Submit>পুনরুদ্ধারের ইমেইল পাঠান</Submit></form></details>
        <Link className="login-back" href="/">← ওয়েবসাইটে ফিরে যান</Link>
      </div>
    </section>
  </div>;
}
