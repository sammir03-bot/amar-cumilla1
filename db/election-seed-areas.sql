-- Election Control Room area seed
-- Safe to re-run. Keeps manually edited publication/status fields unchanged.

insert into public.cumilla_elections
  (upazila, union_slug, union_name, title, status, published, sort_order)
values
  ('daudkandi','daudkandi-north','দাউদকান্দি উত্তর','ইউনিয়ন পরিষদ নির্বাচন','setup',false,10),
  ('daudkandi','sundalpur','সুন্দলপুর','ইউনিয়ন পরিষদ নির্বাচন','setup',false,20),
  ('daudkandi','barpara','বারপাড়া','ইউনিয়ন পরিষদ নির্বাচন','setup',false,30),
  ('daudkandi','gouripur','গৌরীপুর','ইউনিয়ন পরিষদ নির্বাচন','setup',false,40),
  ('daudkandi','jinglatali','জিংলাতলী','ইউনিয়ন পরিষদ নির্বাচন','setup',false,50),
  ('daudkandi','eliotganj-north','ইলিয়টগঞ্জ উত্তর','ইউনিয়ন পরিষদ নির্বাচন','setup',false,60),
  ('daudkandi','eliotganj-south','ইলিয়টগঞ্জ দক্ষিণ','ইউনিয়ন পরিষদ নির্বাচন','setup',false,70),
  ('daudkandi','maligaon','মালিগাঁও','ইউনিয়ন পরিষদ নির্বাচন','setup',false,80),
  ('daudkandi','mohammadpur-west','মোহাম্মদপুর পশ্চিম','ইউনিয়ন পরিষদ নির্বাচন','setup',false,90),
  ('daudkandi','maruka','মারুকা','ইউনিয়ন পরিষদ নির্বাচন','setup',false,100),
  ('daudkandi','biteshwar','বিটেশ্বর','ইউনিয়ন পরিষদ নির্বাচন','setup',false,110),
  ('daudkandi','goalmari','গোয়ালমারী','ইউনিয়ন পরিষদ নির্বাচন','setup',false,120),
  ('daudkandi','padua','পদুয়া','ইউনিয়ন পরিষদ নির্বাচন','setup',false,130),
  ('daudkandi','panchgachia-west','পাঁচগাছিয়া পশ্চিম','ইউনিয়ন পরিষদ নির্বাচন','setup',false,140),
  ('daudkandi','daulatpur','দৌলতপুর','ইউনিয়ন পরিষদ নির্বাচন','setup',false,150),
  ('daudkandi','municipality','দাউদকান্দি পৌরসভা','পৌরসভা নির্বাচন','setup',false,160),
  ('meghna','chandanpur','চন্দনপুর','ইউনিয়ন পরিষদ নির্বাচন','setup',false,210),
  ('meghna','chalibhanga','চালিভাঙ্গা','ইউনিয়ন পরিষদ নির্বাচন','setup',false,220),
  ('meghna','radhangar','রাধানগর','ইউনিয়ন পরিষদ নির্বাচন','setup',false,230),
  ('meghna','manikarchar','মানিকারচর','ইউনিয়ন পরিষদ নির্বাচন','setup',false,240),
  ('meghna','barakanda','বড়কান্দা','ইউনিয়ন পরিষদ নির্বাচন','setup',false,250),
  ('meghna','govindapur','গোবিন্দপুর','ইউনিয়ন পরিষদ নির্বাচন','setup',false,260),
  ('meghna','luterchar','লুটেরচর','ইউনিয়ন পরিষদ নির্বাচন','setup',false,270),
  ('meghna','bhaorkhola','ভাওরখোলা','ইউনিয়ন পরিষদ নির্বাচন','setup',false,280)
on conflict (upazila, union_slug) do update set
  union_name=excluded.union_name,
  title=excluded.title,
  sort_order=excluded.sort_order,
  updated_at=now();
