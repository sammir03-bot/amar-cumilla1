export const MAX_MEDIA_BYTES=8*1024*1024;
export async function inspectMedia(file:Blob){
 if(file.size===0||file.size>MAX_MEDIA_BYTES)return null;
 const bytes=new Uint8Array(await file.arrayBuffer());
 const prefix=String.fromCharCode(...bytes.slice(0,12));
 const png=bytes.length>=8&&bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71&&bytes[4]===13&&bytes[5]===10&&bytes[6]===26&&bytes[7]===10;
 const extension=bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'jpg':png?'png':prefix.startsWith('RIFF')&&prefix.slice(8,12)==='WEBP'?'webp':prefix.startsWith('%PDF-')?'pdf':null;
 if(!extension)return null;
 return {bytes,extension,mime:extension==='jpg'?'image/jpeg':extension==='pdf'?'application/pdf':'image/'+extension};
}
