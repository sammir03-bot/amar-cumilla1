import Link from 'next/link';
import ActionForm from '../../../components/action-form';
import {uploadMedia} from '../actions';

export default function Media(){
  return <section>
    <div className="admin-page-header">
      <div><p className="eyebrow">মিডিয়া</p><h1>ছবি ও PDF</h1><p>প্রকাশনায় ব্যবহার করার জন্য ছবি বা PDF আপলোড করুন। আপলোড শেষে পাওয়া path কপি করে প্রকাশনায় বসান।</p></div>
      <div className="admin-page-actions"><Link className="admin-btn" href="/admin/content/new">নতুন প্রকাশনা →</Link></div>
    </div>

    <ActionForm action={uploadMedia} label="ফাইল আপলোড করুন">
      <div className="admin-form-section">
        <div className="admin-form-section-head"><div><h2>ফাইল নির্বাচন</h2><p>JPG, PNG, WebP অথবা PDF · সর্বোচ্চ ২ MB</p></div></div>
        <div className="admin-upload-box">
          <label>ছবি বা PDF<input type="file" name="file" accept="image/jpeg,image/png,image/webp,application/pdf" required/></label>
          <p>ভালো ফলাফলের জন্য পরিষ্কার ছবি এবং ছোট ফাইল ব্যবহার করুন।</p>
        </div>
      </div>
    </ActionForm>

    <div className="admin-panel" style={{marginTop:18}}>
      <div className="admin-panel-head"><h2>কীভাবে ব্যবহার করবেন</h2></div>
      <div className="admin-quick-grid">
        <div className="admin-quick"><span className="admin-quick-icon">১</span><span><strong>ফাইল বাছাই করুন</strong><small>JPG, PNG, WebP বা PDF</small></span></div>
        <div className="admin-quick"><span className="admin-quick-icon">২</span><span><strong>আপলোড করুন</strong><small>সফল হলে একটি path পাবেন</small></span></div>
        <div className="admin-quick"><span className="admin-quick-icon">৩</span><span><strong>path কপি করুন</strong><small>প্রকাশনার “ফাইল path” ঘরে দিন</small></span></div>
        <div className="admin-quick"><span className="admin-quick-icon">৪</span><span><strong>সংরক্ষণ করুন</strong><small>প্রিভিউ দেখে তারপর প্রকাশ করুন</small></span></div>
      </div>
    </div>
  </section>;
}
