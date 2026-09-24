export type SeoTopic={
  slug:string;
  path:string;
  label:string;
  title:string;
  heading:string;
  description:string;
  intro:string;
  aliases:string[];
  related:{href:string;label:string;description:string}[];
};

export const seoTopics:SeoTopic[]=[
  {
    slug:'cumilla-1-jamaat',
    path:'/cumilla-1-jamaat',
    label:'কুমিল্লা–১',
    title:'কুমিল্লা–১ জামায়াতে ইসলামী সম্পর্কিত তথ্য | দাউদকান্দি ও মেঘনা',
    heading:'কুমিল্লা–১: দাউদকান্দি ও মেঘনায় জামায়াতে ইসলামী সম্পর্কিত স্থানীয় তথ্য',
    description:'কুমিল্লা–১, দাউদকান্দি ও মেঘনায় বাংলাদেশ জামায়াতে ইসলামী সম্পর্কিত প্রকাশিত সংবাদ, স্থানীয় দায়িত্বশীল, কার্যক্রম, প্রার্থী পরিচিতি, এলাকা ও নির্বাচনী তথ্য।',
    intro:'এই বিষয়ভিত্তিক পাতায় কুমিল্লা–১ নির্বাচনী এলাকার দাউদকান্দি ও মেঘনা অংশে বাংলাদেশ জামায়াতে ইসলামী সম্পর্কিত এই সাইটে প্রকাশিত তথ্য দ্রুত খুঁজে পাওয়ার পথ দেখানো হয়েছে।',
    aliases:['কুমিল্লা ১ জামায়াতে ইসলামী','কুমিল্লা-১ জামায়াত','কুমিল্লা ১ জামাত ইসলামি','Cumilla 1 Jamaat','Comilla 1 Jamaat','Cumilla-1 Jamaat-e-Islami','Comilla 1 Jamat Islami'],
    related:[
      {href:'/news',label:'কুমিল্লা–১ সংবাদ',description:'দাউদকান্দি ও মেঘনার প্রকাশিত সংবাদ ও হালনাগাদ।'},
      {href:'/profiles',label:'প্রার্থী ও দায়িত্বশীল',description:'প্রকাশিত ব্যক্তি পরিচিতি, দায়িত্ব ও এলাকা।'},
      {href:'/areas',label:'দাউদকান্দি ও মেঘনা',description:'ইউনিয়ন ও এলাকার যাচাইকৃত স্থানীয় তথ্য।'},
      {href:'/election',label:'নির্বাচনী তথ্য',description:'প্রকাশিত হলে ইউনিয়নভিত্তিক নির্বাচন ও ফলাফলের তথ্য।'},
    ],
  },
  {
    slug:'daudkandi-jamaat',
    path:'/daudkandi-jamaat',
    label:'দাউদকান্দি',
    title:'দাউদকান্দি জামায়াতে ইসলামী সম্পর্কিত স্থানীয় তথ্য',
    heading:'দাউদকান্দি জামায়াতে ইসলামী সম্পর্কিত সংবাদ, দায়িত্বশীল ও এলাকার তথ্য',
    description:'দাউদকান্দিতে বাংলাদেশ জামায়াতে ইসলামী সম্পর্কিত প্রকাশিত সংবাদ, স্থানীয় দায়িত্বশীল, কার্যক্রম, প্রার্থী পরিচিতি, ইউনিয়ন ও নির্বাচনী তথ্য।',
    intro:'দাউদকান্দি সম্পর্কিত প্রকাশিত রাজনৈতিক ও স্থানীয় তথ্য ছড়িয়ে না রেখে এক জায়গা থেকে খুঁজে পাওয়ার জন্য এই বিষয়ভিত্তিক সূচি। তথ্যের উৎস ও হালনাগাদ অবস্থা সংশ্লিষ্ট প্রকাশনায় দেখা যাবে।',
    aliases:['দাউদকান্দি জামায়াতে ইসলামী','দাউদকান্দি জামায়াত','দাউদকান্দি জামাত','দাউদকান্দি জামাত ইসলামি','Daudkandi Jamaat','Daudkandi Jamat','Daudkandi Jamaat-e-Islami','Daudkandi Jamaat Islami'],
    related:[
      {href:'/news',label:'দাউদকান্দির সংবাদ',description:'প্রকাশিত সংবাদ ও স্থানীয় হালনাগাদ দেখুন।'},
      {href:'/areas',label:'দাউদকান্দির ইউনিয়ন',description:'ইউনিয়ন, পৌরসভা ও স্থানীয় তথ্য ঘুরে দেখুন।'},
      {href:'/profiles?type=responsible',label:'স্থানীয় দায়িত্বশীল',description:'প্রকাশিত দায়িত্বশীলদের পরিচিতি দেখুন।'},
      {href:'/sections/event',label:'কার্যক্রম',description:'প্রকাশিত সভা, অনুষ্ঠান ও কার্যক্রমের তথ্য।'},
    ],
  },
  {
    slug:'meghna-jamaat',
    path:'/meghna-jamaat',
    label:'মেঘনা',
    title:'মেঘনা জামায়াতে ইসলামী সম্পর্কিত স্থানীয় তথ্য',
    heading:'মেঘনা জামায়াতে ইসলামী সম্পর্কিত সংবাদ, দায়িত্বশীল ও এলাকার তথ্য',
    description:'মেঘনায় বাংলাদেশ জামায়াতে ইসলামী সম্পর্কিত প্রকাশিত সংবাদ, স্থানীয় দায়িত্বশীল, কার্যক্রম, প্রার্থী পরিচিতি, ইউনিয়ন ও নির্বাচনী তথ্য।',
    intro:'মেঘনা উপজেলার সঙ্গে সম্পর্কিত এই সাইটে প্রকাশিত সংবাদ, দায়িত্বশীল, কার্যক্রম ও এলাকার তথ্যকে একটি পরিষ্কার বিষয়ভিত্তিক প্রবেশপথে সাজানো হয়েছে।',
    aliases:['মেঘনা জামায়াতে ইসলামী','মেঘনা জামায়াত','মেঘনা জামাত','মেঘনা জামাত ইসলামি','Meghna Jamaat','Meghna Jamat','Meghna Jamaat-e-Islami','Meghna Jamaat Islami'],
    related:[
      {href:'/news',label:'মেঘনার সংবাদ',description:'প্রকাশিত সংবাদ ও স্থানীয় হালনাগাদ দেখুন।'},
      {href:'/areas',label:'মেঘনার ইউনিয়ন',description:'ইউনিয়ন ও স্থানীয় তথ্য ঘুরে দেখুন।'},
      {href:'/profiles?type=responsible',label:'স্থানীয় দায়িত্বশীল',description:'প্রকাশিত দায়িত্বশীলদের পরিচিতি দেখুন।'},
      {href:'/sections/event',label:'কার্যক্রম',description:'প্রকাশিত সভা, অনুষ্ঠান ও কার্যক্রমের তথ্য।'},
    ],
  },
  {
    slug:'daripalla',
    path:'/daripalla',
    label:'দাঁড়িপাল্লা',
    title:'দাঁড়িপাল্লা প্রতীক ও কুমিল্লা–১ সম্পর্কিত প্রকাশিত তথ্য',
    heading:'দাঁড়িপাল্লা: কুমিল্লা–১, দাউদকান্দি ও মেঘনা সম্পর্কিত তথ্য',
    description:'দাঁড়িপাল্লা, কুমিল্লা–১, দাউদকান্দি ও মেঘনা সম্পর্কিত এই সাইটে প্রকাশিত প্রার্থী, নির্বাচন, সংবাদ ও স্থানীয় তথ্যের বিষয়ভিত্তিক সূচি।',
    intro:'দাঁড়িপাল্লা শব্দ বা প্রতীক ধরে কুমিল্লা–১ এলাকার তথ্য খুঁজলে সংশ্লিষ্ট প্রকাশিত প্রার্থী, নির্বাচন, সংবাদ ও এলাকার তথ্যের দিকে যাওয়ার জন্য এই সূচি ব্যবহার করা যাবে।',
    aliases:['দাঁড়িপাল্লা','দাঁড়িপাল্লা প্রতীক','কুমিল্লা ১ দাঁড়িপাল্লা','দাউদকান্দি দাঁড়িপাল্লা','মেঘনা দাঁড়িপাল্লা','Daripalla','Dari Palla','Cumilla 1 Daripalla','Comilla 1 Daripalla'],
    related:[
      {href:'/election',label:'নির্বাচনী তথ্য',description:'প্রকাশিত নির্বাচন ও ফলাফলের তথ্য দেখুন।'},
      {href:'/profiles?type=candidate',label:'প্রার্থী পরিচিতি',description:'প্রকাশিত প্রার্থীদের পরিচিতি দেখুন।'},
      {href:'/news',label:'সংবাদ',description:'সাম্প্রতিক প্রকাশিত সংবাদ ও বিবৃতি।'},
      {href:'/areas',label:'এলাকার তথ্য',description:'দাউদকান্দি ও মেঘনার ইউনিয়নভিত্তিক তথ্য।'},
    ],
  },
];

export const seoTopicBySlug=Object.fromEntries(seoTopics.map(topic=>[topic.slug,topic])) as Record<string,SeoTopic>;

export function normalizeSearchTerm(value:string){
  return value.toLocaleLowerCase('bn-BD').replace(/[–—-]/g,' ').replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
}

export function matchSeoTopics(query:string){
  const needle=normalizeSearchTerm(query);
  if(needle.length<2)return [];
  const tokens=needle.split(' ').filter(Boolean);
  return seoTopics.filter(topic=>{
    const haystacks=[topic.heading,topic.label,...topic.aliases].map(normalizeSearchTerm);
    return haystacks.some(text=>text.includes(needle)||needle.includes(text)||(tokens.length>1&&tokens.every(token=>text.includes(token))));
  });
}
