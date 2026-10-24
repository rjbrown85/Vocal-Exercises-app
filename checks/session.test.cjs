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
