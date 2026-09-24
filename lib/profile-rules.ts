export type PhotoMode='keep'|'upload'|'external'|'none';
export type ProfileStatus='draft'|'published'|'archived';

export function resolveProfilePhoto(mode:PhotoMode,existingPath:string|null,existingUrl:string|null,uploaded:string,external:string){
 if(mode==='upload')return uploaded?{photo_path:uploaded,photo_url:null}:null;
 if(mode==='external')return external?{photo_path:null,photo_url:external}:null;
 if(mode==='none')return {photo_path:null,photo_url:null};
 return {photo_path:existingPath,photo_url:existingPath?null:existingUrl};
}

export function canChangeProfile(role:string,previous:ProfileStatus|undefined,next:ProfileStatus){
 if(role==='admin'||role==='publisher')return true;
 return role==='editor'&&previous!=='published'&&next!=='published';
}

export function profileSlug(value:string,name:string,type:string,unique:string){
 if(value)return value.trim().toLowerCase();
 const readable=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,110).replace(/-$/,'');
 return `${readable||type}-${unique.slice(0,8)}`;
}
