import {readFile} from 'node:fs/promises';
import path from 'node:path';

export const runtime='nodejs';
export const dynamic='force-static';

export async function GET(){
  const encoded=await readFile(path.join(process.cwd(),'public','home','user-march.b64.txt'),'utf8');
  const data=Buffer.from(encoded.trim(),'base64');
  return new Response(data,{status:200,headers:{'Content-Type':'image/webp','Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}});
}
