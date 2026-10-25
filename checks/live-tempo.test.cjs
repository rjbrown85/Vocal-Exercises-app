const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),M=require('../dist/music.js');
const src=fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),fn=src.slice(src.indexOf('function runPhrase('),src.indexOf('function manual('));
for(const id of ['f7','f9','i6','rk4','f2','bl2','bl8','r8','j1','j8','p5','p7','a5','a10','chest9','mix9','head6','belt9','breath7'])for(const playback of ['together','echo'])for(const nextTempo of [40,120,160,200,240]){
 let tones=[],clicks=[],timers=[],cancelled=0;const e=M.exercises.find(x=>x.id===id),els={};
 const st={running:true,pending:false,phraseClock:null,exercise:()=>e,M,scale:()=> 'auto',rootNote:48,roots:[48,49],pos:0,repeat:0,holding:false,s:{tempo:80,rhythm:'original',playback,gap:0,bank:e.bank,repeats:1},token:0,ctx:{currentTime:10},save(){},updateKey(){},keyboard(){},highlight(){},finish(){},$:(id)=>els[id]??(els[id]={}),tone:(...args)=>tones.push(args),clickBeat:t=>clicks.push(t),later:(...args)=>timers.push(args),cancel(){cancelled++;tones=[];clicks=[];timers=[];st.token++}};
 vm.createContext(st);vm.runInContext(fn+';runPhrase(true)',st);assert.equal(tones[0][3],.13);const before=st.phraseClock;if(id==='f9')assert(Math.abs(tones[4][1]-(before.base+4*before.beat))<1e-8,'First counting group has a full beat of breathing space');st.ctx.currentTime=before.base+3.25*before.beat;
 vm.runInContext(`setTempo(${nextTempo})`,st);
 assert.equal(cancelled,1);assert.equal(st.pos,0);assert.equal(st.rootNote,48);assert.equal(st.s.tempo,nextTempo);assert(Math.abs(st.phraseClock.base-st.ctx.currentTime-.06)<1e-8);assert.equal(st.phraseClock.cue,false);
 assert(tones.every(x=>x[1]>=st.ctx.currentTime));assert.equal(tones[0][0],48+M.offsets(e)[0]);assert(tones.every(x=>x[5]===0));assert(!tones.some(x=>x[3]===.13&&x[5]===0));for(let i=1;i<clicks.length;i++)assert(Math.abs(clicks[i]-clicks[i-1]-60/nextTempo)<1e-7);
}
console.log('PASS: live tempo restarts the current run from its first note in the same key; no chord restart; future clicks match new BPM in both playback modes.');
