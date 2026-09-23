export const mediaHosts=new Set([
 'www.dailyjanakantha.com','www.shomoyeralo.com','www.bssnews.net','static.dailysangram.com',
 'thebangladeshtoday.com','commons.wikimedia.org','upload.wikimedia.org',
 'meghnanews.com.bd','media.dailynayadiganta.com','images.dailyamardesh.com',
 'old.jaijaidin.news','www.jaijaidin.news','kagoj-bucket.sgp1.digitaloceanspaces.com',
 'www.khaborerkagoj.com','www.ajkerbangladesh.com.bd','www.frontlinebangladesh.com',
 'www.deshrupantor.com','www.ajker-cumilla.com','www.kalerkantho.com','cdn.kalerkantho.com',
]);
export function allowedMediaUrl(raw:string){try{const url=new URL(raw);return url.protocol==='https:'&&!url.username&&!url.password&&(!url.port||url.port==='443')&&mediaHosts.has(url.hostname);}catch{return false;}}
