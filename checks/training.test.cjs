const {test}=require('node:test'),assert=require('node:assert/strict'),M=require('../dist/music.js'),{Runner,frame}=require('../dist/breath.js');
test('every pitched training exercise fits both category presets, including mix',()=>{
 for(const bank of Object.keys(M.trainingBanks))for(const voice of ['baritone','tenor']){
  const range=M.presetRange(bank,voice);
  for(const e of M.exercises.filter(e=>e.bank===bank&&!e.timer)){
   const b=M.bounds(e,range.low,range.high);assert(b.min<=b.max,`${e.id} does not fit ${voice}`);
   for(const root of M.route(b.min,b.max,'back'))for(const n of M.offsets(e))assert(root+n>=range.low&&root+n<=range.high);
  }
 }
 assert.equal(M.presetRange('chest','baritone').high,58);assert.equal(M.presetRange('chest','tenor').high,60);
 assert.equal(M.rangeLimit('belt'),72);assert.deepEqual(M.storedRange('belt','tenor',{low:60,high:80,preset:'custom'}),M.presetRange('belt','tenor'));
 assert.deepEqual(M.presetRange('jazz','tenor'),{low:48,high:76,preset:'tenor'});
});
test('six non-pitched protocols have positive phases, recovery time, and three rounds',()=>{
 const timers=M.exercises.filter(e=>e.timer&&!e.timer.openEnded);assert.equal(timers.length,6);
 for(const e of timers){assert.equal(e.degrees.length,0);assert.equal(e.timer.cycles,3);assert(e.timer.phases.every(p=>p.length>0));assert.equal(e.timer.phases.at(-1).label,'Breathe normally');}
});
function harness(id){let now=0,clicks=0,finished=0,interval,clears=0,latest;
 const runner=new Runner(M.exercises.find(e=>e.id===id).timer,{tempo:120,now:()=>now,every:fn=>{interval=fn;return 1},clear:()=>{clears++;interval=null},click:()=>clicks++,update:f=>latest=f,finish:()=>finished++});
 return {runner,step:n=>{now+=n;interval?.()},get data(){return {clicks,finished,latest,clears}}};
}
test('seconds timer ignores BPM, pauses without consuming time, and completes once',()=>{
 const h=harness('breath1');h.runner.start();h.step(2);assert.equal(h.data.latest.label,'Breathe in');
 h.runner.setTempo(240);h.step(1);assert.equal(h.data.latest.label,'Breathe out');
 h.runner.pause();const offset=h.runner.position();h.step(50);assert.equal(h.runner.position(),offset);
 h.runner.start();h.step(33);assert.equal(h.data.finished,1);assert(h.data.latest.done);h.step(50);assert.equal(h.data.finished,1);
 h.runner.start();assert.equal(h.data.latest.cycle,1);h.runner.reset();assert.equal(h.runner.position(),0);
});
test('bar timer uses four beats per bar and live tempo preserves position',()=>{
 const h=harness('breath4');h.runner.start();h.step(2);assert.equal(h.data.latest.label,'Hiss gently');assert.equal(h.data.latest.bar,1);
 h.step(1);assert.equal(h.runner.position(),6);h.runner.setTempo(60);h.step(2);assert.equal(h.runner.position(),8);assert.equal(h.data.latest.bar,2);
 const before=h.data.clicks;h.step(20);assert(h.data.clicks<=before+1,'No burst of stale clicks after a delayed tick');
 assert.equal(frame(M.exercises.find(e=>e.id==='breath4').timer,60).done,true);
});

test('open sustain timer passes a minute, stops precisely and starts fresh',()=>{
 const h=harness('breath11');h.runner.start();h.step(65.4);assert.equal(h.data.latest.elapsed,65.4);assert.equal(h.data.finished,0);
 h.runner.pause();const stopped=h.runner.position();h.step(10);assert.equal(h.runner.position(),stopped);h.runner.reset();h.runner.start();assert.equal(h.data.latest.elapsed,0);
});
