const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../dist/rnb-music.js');
global.EtudePlayer=require('../dist/etudes-player.js');
const Player=require('../dist/rnb-player.js');
const settings={key:0,register:3,tempo:80,volume:75,mode:'together',repeats:2,gap:4,movement:'stay',drums:'auto'};
test('twenty original vocal phrases have complete bars, singable spans, and full phrase breaths',()=>{
 assert.equal(M.studies.length,20);assert.equal(new Set(M.studies.map(s=>s.id)).size,20);assert.equal(new Set(M.studies.map(s=>JSON.stringify(s.bars))).size,20);
 for(const s of M.studies){
  assert.equal(s.bars.length,2);
  for(const bar of s.bars){assert.equal(bar.reduce((n,e)=>n+e[1],0),4,s.id);assert.equal(bar.at(-1)[0],null);assert(bar.at(-1)[1]>=1);assert(bar.every(e=>e[1]>=.25));}
  for(let key=0;key<12;key++)for(const register of [2,3,4]){const a=M.arrange(s,key,register);assert(a.high-a.low<=12);assert(a.melody.every(n=>n.midi>=36&&n.midi<=83));for(let i=1;i<a.melody.length;i++)assert(Math.abs(a.melody[i].midi-a.melody[i-1].midi)<=7);}
 }
});
test('melody, harmony, bass, and drums share the same beat timeline in every practice mode',()=>{
 for(const study of M.studies)for(const mode of ['together','echo','backing'])for(const drums of ['auto','off','swing','halftime']){
  const events=M.timeline(study,{...settings,mode,drums,movement:'rise',repeats:1,gap:0}),phases=events.filter(e=>e.type==='phase'),notes=events.filter(e=>e.type==='note');
  assert.equal(phases.length,mode==='echo'?10:5);assert.deepEqual([...new Set(phases.map(e=>e.shift))],[0,1,2]);assert(events.every((e,i)=>!i||e.beat>=events[i-1].beat));
  assert(notes.every(e=>e.beat>=4&&e.duration>0&&e.beat+e.duration<=events.at(-1).beat&&e.midi>=0&&e.midi<=127));
  for(const phase of phases){const part=notes.filter(e=>e.beat>=phase.beat&&e.beat<phase.beat+8);const hasLead=part.some(e=>e.channel===0);assert.equal(hasLead,mode!=='backing'&&phase.pass!=='sing');assert(part.some(e=>e.channel===1));assert(part.some(e=>e.channel===2));assert.equal(part.some(e=>e.channel===9),drums!=='off');
   const breaths=events.filter(e=>e.type==='breath'&&e.beat>=phase.beat&&e.beat<phase.beat+8);for(const b of breaths)assert(!part.some(e=>e.channel===0&&e.beat<b.beat+b.duration-1e-8&&e.beat+e.duration>b.beat+1e-8),'vocal lead stays silent in breathing rests');
  }
 }
});
function parse(bytes){
 assert.equal(Buffer.from(bytes.slice(0,4)).toString(),'MThd');assert.equal(bytes[9],0);assert.equal(bytes[11],1);assert.equal(bytes[12]*256+bytes[13],480);assert.equal(Buffer.from(bytes.slice(14,18)).toString(),'MTrk');assert.equal(new DataView(bytes.buffer,bytes.byteOffset).getUint32(18),bytes.length-22);
 let i=22,tick=0;const events=[];const vlq=()=>{let n=0,b;do{b=bytes[i++];n=(n<<7)|(b&127);}while(b&128);return n;};
 while(i<bytes.length){tick+=vlq();const status=bytes[i++];if(status===255){const type=bytes[i++],length=vlq();events.push({tick,status,type,data:[...bytes.slice(i,i+length)]});i+=length;}else{const length=status>>4===12?1:2;events.push({tick,status,data:[...bytes.slice(i,i+length)]});i+=length;}}return events;
}
test('MIDI export matches selected notes, swing, tempo, transposition, echo and breathing gaps',()=>{
 for(const study of M.studies)for(const mode of ['together','echo','backing']){
  const s={...settings,key:11,register:4,tempo:93,mode,movement:'rise',drums:'swing',gap:2};const expected=M.timeline(study,s),actual=parse(M.midi(study,s));
  const tempo=actual.find(e=>e.type===81).data.reduce((n,b)=>n*256+b,0);assert(Math.abs(tempo-60000000/93)<1);assert.equal(actual.at(-1).type,47);assert.equal(actual.at(-1).tick,expected.at(-1).beat*480);
  const on=actual.filter(e=>e.status>>4===9),off=actual.filter(e=>e.status>>4===8);assert.equal(on.length,off.length);
  for(const e of expected.filter(e=>e.type==='note')){assert(on.some(n=>n.status===0x90+e.channel&&n.data[0]===e.midi&&n.tick===Math.round(e.beat*480)));assert(off.some(n=>n.status===0x80+e.channel&&n.data[0]===e.midi&&n.tick===Math.round((e.beat+e.duration)*480)));}
 }
 assert.equal(M.swingBeat(.5,'swing'),.58);
});
function harness(){
 const sources=[],pianoNotes=[],states=[],contexts=[];const param={setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}};
 const source=()=>{const listeners=[];const s={frequency:{},connect(){},disconnect(){},addEventListener(type,fn){listeners.push(fn);},start(time){this.time=time;},stop(time){this.stopTime=time;if(time===undefined)this.cancelled=true;},fadeOut(){this.cancelled=true;}};sources.push(s);return s;};
 const createAudio=()=>{const listeners=[];const context={state:'running',currentTime:0,sampleRate:1000,destination:{},resume:async()=>{},close:async()=>{context.state='closed';},addEventListener(t,fn){listeners.push(fn);},removeEventListener(){},interrupt(){this.state='interrupted';listeners.forEach(fn=>fn());},createBuffer:(n,length)=>({getChannelData:()=>new Float32Array(length)}),createGain:()=>({gain:param,connect(){},disconnect(){}}),createOscillator:source,createBufferSource:source};contexts.push(context);return {context,master:{gain:param},piano:{load:async()=>{},play(midi,time,duration){pianoNotes.push({midi,time,duration});const s=source();s.start(time);return s;}}};};
 const player=new Player({createAudio,onState:s=>states.push(s)});return {player,sources,pianoNotes,states,contexts};
}
test('all instruments schedule together and stop cancels queued drums, bass and piano',async()=>{
 const h=harness(),events=M.timeline(M.studies[0],{...settings,repeats:1});await h.player.start(events,{...settings,tempo:120});
 h.contexts[0].currentTime=2.12;h.player.tick();const at=h.sources.filter(s=>s.time===2.12);assert(at.length>=8,'lead, four chord tones, bass, kick and hat share a start time');
 const scheduled=[...h.player.voices];h.player.stop();assert(scheduled.every(s=>s.cancelled));assert.equal(h.player.timer,null);
});
test('changing tempo restarts one clock and interruption recovers all instruments together',async()=>{
 const h=harness(),events=M.timeline(M.studies[2],settings);await h.player.start(events,{...settings,tempo:80});const old=[...h.player.voices];await h.player.start(events,{...settings,tempo:100});assert(old.every(s=>s.cancelled));assert.equal(h.player.beatSeconds,.6);
 h.contexts[0].interrupt();assert.equal(h.player.state,'idle');assert.equal(h.states.at(-1),'interrupted');await h.player.start(events,settings);assert.equal(h.contexts.length,2);assert.equal(h.player.state,'playing');assert(h.player.audio.kit[36]);h.player.stop();
});
