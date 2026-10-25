const {test}=require('node:test'),assert=require('node:assert/strict'),{play}=require('../dist/synth.js');
test('slides use a single continuous pitch envelope with a quiet release and cancellation',()=>{
 const frequencies=[],stops=[];let oscillators=0;
 const param={setValueAtTime(...a){frequencies.push(['set',...a])},exponentialRampToValueAtTime(...a){frequencies.push(['ramp',...a])}};
 const ctx={currentTime:2,createOscillator(){oscillators++;return {frequency:param,connect(){},disconnect(){},start(t){assert.equal(t,3)},stop(t){stops.push(t)},addEventListener(){}}},createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){},setTargetAtTime(){}},connect(){},disconnect(){}}}};
 const source=play(ctx,{},[60,64,60],[1,1,2],3,.5);assert.equal(oscillators,1);
 assert.deepEqual(frequencies.filter(x=>x[0]==='ramp').map(x=>x[2]),[4,5]);assert(Math.abs(stops[0]-7.7)<1e-8);
 source.fadeOut();assert.equal(stops.at(-1),2.08);
});
