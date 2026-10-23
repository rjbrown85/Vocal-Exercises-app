const assert=require('node:assert/strict');require('../dist/piano.js');
(async()=>{
 let requests=0,fail=false,created=[];
 global.fetch=async()=>{requests++;if(fail)throw Error('network');return {ok:true,arrayBuffer:async()=>new ArrayBuffer(8)}};
 const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}});
 const ctx={decodeAudioData:async()=>({duration:8}),createGain:()=>({gain:param(),connect(){},disconnect(){}}),createBufferSource:()=>{const s={playbackRate:param(),connect(){},disconnect(){},start(t){this.startTime=t},stop(t){this.stopTime=t},addEventListener(){}};created.push(s);return s}};
 const p=new SamplePiano(ctx,{});await Promise.all([p.load(),p.load()]);assert.equal(requests,17);assert.equal(p.buffers.size,17);await p.load();assert.equal(requests,17);
 for(let n=36;n<=84;n++){const source=p.play(n,1,.5);const root=36+Math.round((n-36)/3)*3;assert.equal(source.playbackRate.value,2**((n-root)/12));assert(source.stopTime>source.startTime+.5)}
 const retry=new SamplePiano(ctx,{});fail=true;await assert.rejects(retry.load());assert.equal(retry.buffers.size,0);fail=false;await retry.load();assert.equal(retry.buffers.size,17);
 console.log('PASS: shared sample loading, cached reuse, 49 pitches, release timing, failed-load retry.');
})().catch(e=>{console.error(e);process.exit(1)});
