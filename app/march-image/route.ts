import {readFile} from 'node:fs/promises';
import path from 'node:path';

export const runtime='nodejs';
export const dynamic='force-static';

export async function GET(){
  const data=await readFile(path.join(process.cwd(),'march.jpg'));
  return new Response(data,{status:200,headers:{'Content-Type':'image/jpeg','Cache-Control':'public, max-age=31536000, immutable','Content-Length':String(data.length),'X-Content-Type-Options':'nosniff'}});
}
