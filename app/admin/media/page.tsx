import ActionForm from '../../../components/action-form';
import {uploadMedia} from '../actions';
export default function Media(){return <><h1>ছবি ও PDF</h1><p>আপলোড শেষে পাওয়া path প্রকাশনার ফাইল ঘরে দিন। সর্বোচ্চ ২ MB।</p><ActionForm action={uploadMedia} label="আপলোড করুন"><label>ফাইল নির্বাচন<input type="file" name="file" accept="image/jpeg,image/png,image/webp,application/pdf" required/></label></ActionForm></>;}
