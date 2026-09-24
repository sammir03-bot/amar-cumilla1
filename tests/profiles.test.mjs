import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import test from 'node:test';
const require=createRequire(import.meta.url),ts=require('typescript');
const compiled=ts.transpileModule(readFileSync(new URL('../lib/profile-rules.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const module={exports:{}};new Function('exports','module',compiled)(module.exports,module);
const {resolveProfilePhoto,canChangeProfile,profileSlug}=module.exports;
const old='user/old.jpg',next='user/new.png',remote='https://www.bssnews.net/photo.jpg';
test('removing a photo clears both uploaded and remote variants',()=>{
 assert.deepEqual(resolveProfilePhoto('none',old,remote,'',''),{photo_path:null,photo_url:null});
});
test('choosing a remote photo actually replaces the previous uploaded photo',()=>{
 assert.deepEqual(resolveProfilePhoto('external',old,null,'',remote),{photo_path:null,photo_url:remote});
 assert.equal(resolveProfilePhoto('external',old,null,'',''),null);
});
test('new upload wins and saving text alone preserves the exact original photo',()=>{
 assert.deepEqual(resolveProfilePhoto('upload',old,remote,next,''),{photo_path:next,photo_url:null});
 assert.deepEqual(resolveProfilePhoto('keep',old,null,'',remote),{photo_path:old,photo_url:null});
 assert.deepEqual(resolveProfilePhoto('keep',null,remote,'',''),{photo_path:null,photo_url:remote});
 assert.equal(resolveProfilePhoto('upload',old,null,'',''),null);
});
test('an editor cannot publish, unpublish or edit an already published profile',()=>{
 for(const target of ['draft','published','archived'])assert.equal(canChangeProfile('editor','published',target),false);
 assert.equal(canChangeProfile('editor','draft','published'),false);
 assert.equal(canChangeProfile('editor','draft','draft'),true);
 assert.equal(canChangeProfile('publisher','draft','published'),true);
 assert.equal(canChangeProfile('admin','published','draft'),true);
 assert.equal(canChangeProfile('unknown','draft','draft'),false);
});
test('Bangla names need no manual English slug, and existing public links remain stable',()=>{
 assert.equal(profileSlug('','পূর্ণ বাংলা নাম','candidate','12345678-abcd'),'candidate-12345678');
 assert.equal(profileSlug('md-bahlul','নতুন নাম','responsible','87654321'),'md-bahlul');
 assert.equal(profileSlug('','John Doe','candidate','12345678'),'john-doe-12345678');
});
