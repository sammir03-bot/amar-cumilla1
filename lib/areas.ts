export const areas = [
  ['daudkandi','daudkandi-north','দাউদকান্দি উত্তর'],['daudkandi','sundalpur','সুন্দলপুর'],['daudkandi','barpara','বারপাড়া'],['daudkandi','gouripur','গৌরীপুর'],['daudkandi','jinglatali','জিংলাতলী'],['daudkandi','eliotganj-north','ইলিয়টগঞ্জ উত্তর'],['daudkandi','eliotganj-south','ইলিয়টগঞ্জ দক্ষিণ'],['daudkandi','maligaon','মালিগাঁও'],['daudkandi','mohammadpur-west','মোহাম্মদপুর পশ্চিম'],['daudkandi','maruka','মারুকা'],['daudkandi','biteshwar','বিটেশ্বর'],['daudkandi','goalmari','গোয়ালমারী'],['daudkandi','padua','পদুয়া'],['daudkandi','panchgachia-west','পাঁচগাছিয়া পশ্চিম'],['daudkandi','daulatpur','দৌলতপুর'],['daudkandi','municipality','দাউদকান্দি পৌরসভা'],
  ['meghna','chandanpur','চন্দনপুর'],['meghna','chalibhanga','চালিভাঙ্গা'],['meghna','radhangar','রাধানগর'],['meghna','manikarchar','মানিকারচর'],['meghna','barakanda','বড়কান্দা'],['meghna','govindapur','গোবিন্দপুর'],['meghna','luterchar','লুটেরচর'],['meghna','bhaorkhola','ভাওরখোলা'],
].map(([upazila,slug,name])=>({upazila,slug,name,type:slug==='municipality'?'পৌরসভা':'ইউনিয়ন',verified:false}));
export const upazilaNames: Record<string,string> = {daudkandi:'দাউদকান্দি',meghna:'মেঘনা'};
export const sourceLinks: Record<string,string> = {
  daudkandi:'https://daudkandi.comilla.gov.bd/pages/static-pages/69912931516a96d4de4084bf',
  meghna:'https://meghna.comilla.gov.bd/pages/static-pages/6991384d516a96d4de40c434',
};
