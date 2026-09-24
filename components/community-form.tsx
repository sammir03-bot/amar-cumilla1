import Link from 'next/link';
import {submitCommunityForm} from '../app/community-actions';
import styles from '../app/community-form.module.css';

type Kind='join'|'problem'|'feedback';

type Props={
  kind:Kind;
  kicker:string;
  title:string;
  description:string;
  subjectLabel:string;
  subjectPlaceholder:string;
  messageLabel:string;
  messagePlaceholder:string;
  button:string;
  sent?:boolean;
  error?:boolean;
};

export default function CommunityForm({kind,kicker,title,description,subjectLabel,subjectPlaceholder,messageLabel,messagePlaceholder,button,sent,error}:Props){
  return <main className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroCopy}><span>{kicker}</span><h1>{title}</h1><p>{description}</p></div>
      <div className={styles.heroBadge}>AMAR CUMILLA–1<br/><small>DAUDKANDI &amp; MEGHNA</small></div>
    </section>

    <section className={styles.formShell}>
      {sent&&<div className={styles.success}><strong>ধন্যবাদ।</strong><span>আপনার তথ্য গ্রহণ করা হয়েছে। প্রয়োজন অনুযায়ী অনুমোদিত দায়িত্বশীলরা এটি পর্যালোচনা করবেন।</span></div>}
      {error&&<div className={styles.error}><strong>জমা হয়নি।</strong><span>প্রয়োজনীয় ঘরগুলো ঠিকভাবে পূরণ করে আবার চেষ্টা করুন।</span></div>}

      <form action={submitCommunityForm} className={styles.form}>
        <input type="hidden" name="type" value={kind}/>
        <label className={styles.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>

        <div className={styles.formIntro}>
          <span>আপনার তথ্য</span>
          <h2>{kind==='join'?'যোগদানের আগ্রহ জানান':kind==='problem'?'এলাকার সমস্যা বিস্তারিত লিখুন':'আপনার মতামত আমাদের জানান'}</h2>
          <p>শুধু প্রয়োজনীয় তথ্য দিন। NID, ব্যাংক তথ্য, পাসওয়ার্ড বা অন্য কোনো অতিরিক্ত সংবেদনশীল তথ্য লিখবেন না।</p>
        </div>

        <div className={styles.grid}>
          <label>পূর্ণ নাম<input name="full_name" required minLength={2} maxLength={120} placeholder="আপনার নাম"/></label>
          <label>ফোন নম্বর{kind!=='join'&&<small> (ঐচ্ছিক)</small>}<input name="phone" required={kind==='join'} maxLength={40} inputMode="tel" placeholder="01XXXXXXXXX"/></label>
          <label>ইমেইল <small>(ঐচ্ছিক)</small><input type="email" name="email" maxLength={180} placeholder="name@example.com"/></label>
          <label>উপজেলা<select name="upazila" required defaultValue=""><option value="" disabled>নির্বাচন করুন</option><option value="daudkandi">দাউদকান্দি</option><option value="meghna">মেঘনা</option></select></label>
          <label>ইউনিয়ন / পৌরসভা<input name="union_name" maxLength={160} placeholder="যেমন: গৌরীপুর / দাউদকান্দি পৌরসভা"/></label>
          <label>{subjectLabel}<input name="subject" maxLength={220} placeholder={subjectPlaceholder}/></label>
        </div>

        <label className={styles.message}>{messageLabel}<textarea name="message" required minLength={3} maxLength={6000} rows={8} placeholder={messagePlaceholder}/></label>

        <label className={styles.consent}><input type="checkbox" name="consent" required/><span>আমি <Link href="/privacy">গোপনীয়তা নীতি</Link> পড়েছি এবং সম্মতি দিচ্ছি যে এই ফর্মে দেওয়া তথ্য যোগাযোগ, আবেদন/সমস্যা/মতামত পর্যালোচনা ও প্রয়োজনীয় ফলো-আপের জন্য অনুমোদিত দায়িত্বশীলরা ব্যবহার করতে পারবেন।</span></label>

        <div className={styles.actions}><button type="submit">{button} <b>→</b></button><Link href="/privacy">গোপনীয়তা নীতি</Link><Link href="/">হোমে ফিরুন</Link></div>
      </form>
    </section>
  </main>;
}
