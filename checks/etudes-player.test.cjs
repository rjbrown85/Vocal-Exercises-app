const {test}=require('node:test'),assert=require('node:assert/strict');
const Player=require('../dist/etudes-player.js');
const M=require('../dist/etudes-music.js');
const settings={tempo:120,volume:80,accompaniment:'held',metronome:false};
function harness(){
  const loads=[],notes=[],states=[],events=[];
  const param={setValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}};
  function source(){return {frequency:{},connect(){},disconnect(){},start(){},stop(){this.stopped=true;},addEventListener(){},fadeOut(){this.stopped=true;}};}
  const context={currentTime:0,resume:async()=>{},createOscillator:source,createGain:()=>({gain:param,connect(){},disconnect(){}})};
  const piano={load:()=>new Promise((resolve,reject)=>loads.push({resolve,reject})),play(...args){const voice=source();notes.push({args,voice});return voice;}};
  const player=new Player({createAudio:()=>({context,piano,master:{gain:param}}),onState:s=>states.push(s),onEvent:e=>events.push(e)});
  return {player,context,loads,notes,states,events};
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
