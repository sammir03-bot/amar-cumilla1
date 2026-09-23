import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import test from 'node:test';
const require=createRequire(import.meta.url),ts=require('typescript');
function moduleAt(path){const code=ts.transpileModule(readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};new Function('exports','module',code)(module.exports,module);return module.exports;}
const {postCoverPath,resolveCoverSelection}=moduleAt('../lib/post-cover.ts');
const {inspectMedia}=moduleAt('../lib/upload-types.ts');
const {allowedMediaUrl}=moduleAt('../lib/remote-media.ts');
const a='user/image-a.jpg',b='user/image-b.png';
test('an explicitly chosen second photo stays identical on every surface',()=>{assert.equal(postCoverPath({media_paths:[a,b],cover_selection:b,cover_url:'https://source/photo.jpg'}),b);assert.equal(postCoverPath({media_paths:[a],cover_selection:b}),null);});
test('external and no-photo choices never silently fall back to an attachment',()=>{assert.equal(postCoverPath({media_paths:[a],cover_selection:'external',cover_url:'https://source/photo.jpg'}),'https://source/photo.jpg');assert.equal(postCoverPath({media_paths:[a],cover_selection:'none'}),null);assert.equal(postCoverPath({media_paths:[a],cover_selection:'external'}),null);});
test('new file selection maps by upload position, without allowing a PDF or invalid index',()=>{assert.equal(resolveCoverSelection('new:1',[],[a,b],''),b);assert.equal(resolveCoverSelection('new:0',[],['x.pdf'],''),null);assert.equal(resolveCoverSelection('new:12',[],[a],''),null);assert.equal(resolveCoverSelection(b,[a],[],''),null);});
test('older records preserve their existing photo choice',()=>{assert.equal(postCoverPath({media_paths:['x.pdf',a],cover_url:'https://source/photo.jpg'}),a);});
test('file headers, not filenames, determine supported uploads',async()=>{assert.equal((await inspectMedia(new Blob([new Uint8Array([137,80,78,71,13,10,26,10])]))).extension,'png');assert.equal((await inspectMedia(new Blob(['%PDF-1.7']))).extension,'pdf');assert.equal(await inspectMedia(new Blob(['<script>alert(1)</script>'],{type:'image/png'})),null);assert.equal(await inspectMedia(new Blob([new Uint8Array(8*1024*1024+1)])),null);});
test('remote image proxy only accepts HTTPS on reviewed hosts and normal ports',()=>{assert.equal(allowedMediaUrl('https://www.bssnews.net/photo.jpg'),true);for(const url of ['http://www.bssnews.net/photo.jpg','https://127.0.0.1/x','https://www.bssnews.net.evil.test/x','https://user:password@www.bssnews.net/x','https://www.bssnews.net:444/x'])assert.equal(allowedMediaUrl(url),false);});
