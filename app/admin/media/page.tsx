import Link from 'next/link';
import ActionForm from '../../../components/action-form';
import {uploadMedia} from '../actions';

export default function Media(){
  return <section>
    <div className="admin-page-header">
      <div><p className="eyebrow">মিডিয়া</p><h1>ছবি ও PDF</h1><p>সাধারণ প্রকাশনা তৈরির সময় এখানে আগে আপলোড করার দরকার নেই। প্রকাশনা ফর্ম থেকেই সরাসরি ছবি নির্বাচন করা যায়। এই পেজটি আলাদা ফাইল সংরক্ষণের জন্য রাখা হয়েছে।</p></div>
      <div className="admin-page-actions"><Link className="admin-btn primary" href="/admin/content/new">＋ নতুন প্রকাশনা</Link></div>
    </div>

    <ActionForm action={uploadMedia} label="ফাইল আপলোড করুন">
      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>আলাদা ফাইল আপলোড</h2><p>JPG, PNG, WebP অথবা PDF · সর্বোচ্চ ৮ MB</p></div></div>
        <div className="admin-upload-box">
          <label>ছবি বা PDF<input type="file" name="file" accept="image/jpeg,image/png,image/webp,application/pdf" required/></label>
          <p>এটি ঐচ্ছিক। নতুন প্রকাশনা লিখলে সেখান থেকেই ছবি সরাসরি যুক্ত করা সবচেয়ে সহজ।</p>
        </div>
      </div>
    </ActionForm>

    <div className="admin-panel" style={{marginTop:18}}>
      <div className="admin-panel-head"><h2>সবচেয়ে সহজ উপায়</h2></div>
      <div className="admin-quick-grid">
        <Link className="admin-quick" href="/admin/content/new"><span className="admin-quick-icon">১</span><span><strong>নতুন প্রকাশনা খুলুন</strong><small>লেখা, বিভাগ ও এলাকা দিন</small></span></Link>
        <div className="admin-quick"><span className="admin-quick-icon">২</span><span><strong>ছবি নির্বাচন করুন</strong><small>Gallery থেকে সরাসরি ৪টি পর্যন্ত</small></span></div>
        <div className="admin-quick"><span className="admin-quick-icon">৩</span><span><strong>সংরক্ষণ করুন</strong><small>লেখা ও ছবি একসাথে আপলোড হবে</small></span></div>
        <div className="admin-quick"><span className="admin-quick-icon">✓</span><span><strong>কাজ শেষ</strong><small>আলাদা path কপি করতে হবে না</small></span></div>
      </div>
    </div>
  </section>;
}
