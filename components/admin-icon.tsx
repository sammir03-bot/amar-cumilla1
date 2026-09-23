import type {CSSProperties} from 'react';
const paths:Record<string,string>={
 grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
 file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h5',
 image:'M3 3h18v18H3z M3 16l5-5 4 4 3-3 6 6 M15 7h.01',
 inbox:'M4 4h16l2 12v4H2v-4z M2 16h6l2 3h4l2-3h6',
 pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0 M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
 chart:'M4 3v18h18 M9 16v-5 M14 16V7 M19 16V4',
 history:'M3 11a9 9 0 1 1 2.5 7 M3 4v7h7 M12 7v5l3 2',
 users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
 plus:'M12 5v14 M5 12h14',arrow:'M5 12h14 M14 7l5 5-5 5',
 external:'M14 3h7v7 M21 3l-9 9 M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5',
 search:'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',menu:'M4 6h16 M4 12h16 M4 18h16',close:'M6 6l12 12 M18 6 6 18',
 check:'M5 12l4 4L19 6',clock:'M12 8v4l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
 upload:'M12 16V3 M7 8l5-5 5 5 M3 15v6h18v-6',
 eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
 link:'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2 M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2',
 settings:'M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M10 15v6',logout:'M9 3H3v18h6 M9 12h12 M17 8l4 4-4 4'
};
export default function AdminIcon({name,size=20,style}:{name:string;size?:number;style?:CSSProperties}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}><path d={paths[name]??paths.file}/></svg>;}
