export type CoverRecord={cover_selection?:string|null;cover_url?:string|null;media_paths?:string[]|null};
export const isImagePath=(path:string)=>!path.toLowerCase().endsWith('.pdf');
/** Explicit choices never fall back to a different photograph. Null preserves legacy records. */
export function postCoverPath(post:CoverRecord):string|null{
 if(post.cover_selection==='none')return null;
 if(post.cover_selection==='external')return post.cover_url||null;
 if(post.cover_selection)return (post.media_paths??[]).includes(post.cover_selection)&&isImagePath(post.cover_selection)?post.cover_selection:null;
 return (post.media_paths??[]).find(isImagePath)||post.cover_url||null;
}
export function resolveCoverSelection(choice:string,existing:string[],uploaded:string[],external:string):string|null{
 if(choice==='none')return 'none';
 if(choice==='external')return external?'external':null;
 if(choice.startsWith('new:')){const index=Number(choice.slice(4));const path=Number.isInteger(index)&&index>=0?uploaded[index]:undefined;return path&&isImagePath(path)?path:null;}
 return existing.includes(choice)&&isImagePath(choice)?choice:null;
}
