const {test}=require('node:test'),assert=require('node:assert/strict');
const Player=require('../dist/etudes-player.js');
const M=require('../dist/etudes-music.js');
const settings={tempo:120,volume:80,accompaniment:'held',metronome:false};
function harness(options={}){
  const loads=[],notes=[],states=[],events=[];
  const param={setValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}};
  function source(){return {frequency:{},connect(){},disconnect(){},start(){},stop(){this.stopped=true;},addEventListener(){},fadeOut(){this.stopped=true;}};}
  function makeContext(){
    const listeners=new Set();
    return {currentTime:0,state:'running',resume:async function(){this.state='running';},close:async function(){this.state='closed';},
      addEventListener(type,fn){listeners.add(fn);},removeEventListener(type,fn){listeners.delete(fn);},
      changeState(state){this.state=state;listeners.forEach(fn=>fn());},
      createOscillator:source,createGain:()=>({gain:param,connect(){},disconnect(){}})};
  }
  const context=makeContext(),contexts=[];
  const piano={load:()=>new Promise((resolve,reject)=>loads.push({resolve,reject})),play(...args){const voice=source();notes.push({args,voice});return voice;}};
  const player=new Player({createAudio:()=>{const next=contexts.length?makeContext():context;contexts.push(next);return {context:next,piano:{...piano},master:{gain:param}};},onState:s=>states.push(s),onEvent:e=>events.push(e),...options});
  return {player,context,contexts,loads,notes,states,events};
}
const flush=()=>new Promise(setImmediate);
test('cancelled and stale sample loads never restart playback or override a newer session',async()=>{
  const h=harness(),events=M.timeline(M.arrange(M.progressions[0],M.styles[0]));
  const first=h.player.start(events,settings);await flush();h.player.stop();
  const second=h.player.start(events,settings);await flush();h.loads[1].resolve();await second;
  assert.equal(h.player.state,'playing');h.loads[0].reject(Error('old failure'));await first;
  assert.equal(h.player.state,'playing');assert(!h.states.includes('error'));
  h.player.stop();assert.equal(h.player.timer,null);
});

test('Safari interruption stops scheduled sound and the next tap rebuilds the context with cached samples',async()=>{
  const h=harness(),timeline=M.timeline(M.arrange(M.progressions[0],M.styles[0]));
  const start=h.player.start(timeline,settings);await flush();h.loads[0].resolve();await start;
  h.player.audio.piano.buffers=new Map(Array.from({length:17},(_,n)=>[n,{sample:n}]));
  const samples=h.player.audio.piano.buffers;
  h.context.currentTime=2.12;h.player.tick();const voices=[...h.player.voices];
  h.context.changeState('interrupted');
  assert.equal(h.player.state,'idle');assert.equal(h.player.timer,null);
  assert(h.states.includes('interrupted'));assert(voices.every(v=>v.stopped));
  const retry=h.player.start(timeline,settings);await flush();
  assert.equal(h.contexts.length,2);assert.equal(h.context.state,'closed');
  assert.equal(h.player.audio.piano.buffers,samples,'decoded samples are reused');
  h.loads[1].resolve();await retry;assert.equal(h.player.state,'playing');h.player.stop();
});

test('a pending Safari resume times out with a retry path instead of loading forever',async()=>{
  const h=harness({resumeTimeoutMs:20});h.context.resume=()=>new Promise(()=>{});
  const timeline=M.timeline(M.arrange(M.progressions[0],M.styles[0]));
  await h.player.start(timeline,settings);
  assert.equal(h.player.state,'idle');assert(h.states.includes('interrupted'));
  assert.equal(h.player.cancelResume,null);assert.equal(h.player.timer,null);
  const retry=h.player.start(timeline,settings);await flush();h.loads[0].resolve();await retry;
  assert.equal(h.contexts.length,2);assert.equal(h.player.state,'playing');h.player.stop();
});

test('stop cancels an unresolved resume without starting audio later',async()=>{
  const h=harness();let resume;
  h.context.resume=()=>new Promise(resolve=>resume=resolve);
  const started=h.player.start([],settings);h.player.stop();await started;
  resume();await flush();assert.equal(h.loads.length,0);assert.equal(h.player.state,'idle');assert.equal(h.player.cancelResume,null);
});

test('an interruption while samples load never claims to be playing',async()=>{
  const h=harness();const started=h.player.start([],settings);await flush();
  h.context.changeState('interrupted');h.loads[0].resolve();await started;
  assert(!h.states.includes('playing'));assert(h.states.includes('interrupted'));assert.equal(h.player.timer,null);
});

test('a stalled audio clock offers recovery even if Safari still reports running',async()=>{
  const h=harness();const started=h.player.start([{type:'end',beat:100}],settings);await flush();h.loads[0].resolve();await started;
  h.player.lastClockAdvance-=2100;h.player.tick();assert(h.states.includes('interrupted'));assert.equal(h.player.state,'idle');assert.equal(h.player.timer,null);
});

test('the larger scheduling window keeps upcoming melody notes ready through a short UI stall',async()=>{
  const h=harness();const started=h.player.start([{type:'melody',beat:.6,midi:60,duration:.5,audible:true},{type:'end',beat:10}],settings);
  await flush();h.loads[0].resolve();await started;
  h.context.currentTime=.1;h.player.tick();assert.equal(h.notes.length,1);assert.equal(h.notes[0].args[1],.42);
  h.context.currentTime=.5;h.player.tick();assert.equal(h.notes.length,1,'scheduled note is neither skipped nor duplicated');h.player.stop();
});
test('audio failures allow retry and stop cancels all scheduled chord and melody voices',async()=>{
  const h=harness(),a=M.arrange(M.progressions[0],M.styles[0]);
  const failed=h.player.start(M.timeline(a),settings);await flush();h.loads[0].reject(Error('offline'));await failed;
  assert.equal(h.player.state,'idle');assert(h.states.includes('error'));
  const retry=h.player.start(M.timeline(a),settings);await flush();h.loads[1].resolve();await retry;
  h.context.currentTime=2.12;h.player.tick();
  assert(h.notes.length>=5,'bass, triad and guide sound together');
  const sources=[...h.player.voices];h.player.stop();
  assert(sources.every(source=>source.stopped));assert.equal(h.player.voices.size,0);assert.equal(h.player.timer,null);
});
test('backing mode schedules harmony but no melody and completes without stray timers',async()=>{
  const h=harness(),a=M.arrange(M.progressions[0],M.styles[0]);
  const started=h.player.start(M.timeline(a,'backing',1,0),settings);await flush();h.loads[0].resolve();await started;
  h.context.currentTime=2.12;h.player.tick();assert.equal(h.notes.length,4);
  h.context.currentTime=10.13;h.player.tick();assert.equal(h.player.state,'idle');assert.equal(h.player.timer,null);assert(h.states.includes('complete'));
});
test('broken and pulse accompaniment use the same harmony at intended beat positions',async()=>{
  for(const [pattern,count] of [['broken',9],['pulse',10]]){
    const h=harness(),a=M.arrange(M.progressions[0],M.styles[0]);
    const started=h.player.start(M.timeline(a,'backing',1,0),{...settings,accompaniment:pattern});await flush();h.loads[0].resolve();await started;
    h.context.currentTime=2.12;h.player.tick();assert.equal(h.notes.length,count);
    assert(h.notes.every(n=>n.args[1]>=2.12&&n.args[1]<4.12));h.player.stop();
  }
});
