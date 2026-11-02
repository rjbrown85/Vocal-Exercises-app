const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const load=()=>{const session={type:'auto'},st={navigator:{audioSession:session,userAgent:'iPhone',platform:'iPhone',maxTouchPoints:5},Date,setTimeout,clearTimeout,Audio:class{}};
 vm.createContext(st);vm.runInContext(fs.readFileSync(require.resolve('../dist/session.js'),'utf8')+';globalThis.S=Sound',st);return {S:st.S,session}};
test('piano sound ignores the silent switch only while it plays',async()=>{
 const {S,session}=load();
 assert.equal(session.type,'ambient','page starts out following the silent switch');
 S.hold();assert.equal(session.type,'playback');assert.equal(S.active,true);
 S.release(0);assert.equal(session.type,'ambient');assert.equal(S.active,false);
 S.keep(30);assert.equal(session.type,'playback','a single note switches to playback');
 await new Promise(r=>setTimeout(r,60));assert.equal(session.type,'ambient','and switches back after it rings out');
});
test('stopping when nothing is playing never switches to playback',()=>{
 const {S,session}=load();
 S.release(1500);assert.equal(session.type,'ambient');assert.equal(S.active,false);
});
test('a new Play tap reapplies playback mode after an external audio session change',()=>{
 const {S,session}=load();S.hold();session.type='ambient';S.hold();
 assert.equal(session.type,'playback');S.release(0);
});
test('iPad desktop user agent uses the media fallback when the audio-session setter fails',()=>{
 let plays=0,pauses=0,created=0;
 const session={set type(value){if(value==='playback')throw Error('unsupported')}};
 const st={navigator:{audioSession:session,userAgent:'Macintosh',platform:'MacIntel',maxTouchPoints:5},Date,setTimeout,clearTimeout,
  Audio:class{constructor(){created++;}setAttribute(){}play(){plays++;return Promise.resolve();}pause(){pauses++;}}};
 vm.createContext(st);vm.runInContext(fs.readFileSync(require.resolve('../dist/session.js'),'utf8')+';globalThis.S=Sound',st);
 st.S.hold();assert.equal(plays,1);assert.equal(created,1);
 st.S.release(0);assert.equal(pauses,1,'fallback stops even when setting ambient succeeds');
 st.S.hold();assert.equal(plays,2);assert.equal(created,1,'reuse the same media element');st.S.release(0);
});
