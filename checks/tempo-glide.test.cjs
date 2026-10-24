const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('tempo drag uses one continuous voice and resumes the phrase once',async()=>{
 let oscillators=0,cancels=0,resumes=0;
 const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},cancelAndHoldAtTime(){},setTargetAtTime(){}}),els={};
 const st={ctx:{currentTime:11,createOscillator(){oscillators++;return {frequency:param(),connect(){},start(){},stop(){},disconnect(){}}},createGain(){return {gain:param(),connect(){},disconnect(){}}}},master:{},Sound:{hold(){},keep(){},release(){}},s:{tempo:80,volume:65},running:true,phraseClock:{base:10,beat:.75,cue:true},token:0,cancel(){cancels++;st.token++},initAudio:async()=>{},save(){},runPhrase(){resumes++},$:id=>els[id]??(els[id]={addEventListener(){}}),window:{addEventListener(){}},document:{addEventListener(){}}};
 vm.createContext(st);vm.runInContext(fs.readFileSync(require.resolve('../dist/tempo.js'),'utf8')+';globalThis.scrub=tempoScrub',st);
 await st.scrub.start();for(const tempo of [85,100,125,140])st.scrub.update(tempo);
 assert.equal(oscillators,1);assert.equal(cancels,1);assert.equal(resumes,0);assert.equal(st.s.tempo,140);
 st.scrub.end();st.scrub.end();assert.equal(resumes,1);
 let release;st.initAudio=()=>new Promise(r=>release=r);const pending=st.scrub.start();st.scrub.end();release();await pending;assert.equal(oscillators,1,'late audio initialization must not create a stuck tone');
});
