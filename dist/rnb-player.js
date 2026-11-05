'use strict';
// Melody, harmony, bass and drums are scheduled by EtudePlayer on one audio clock.
class RnbPlayer extends EtudePlayer {
 prepareAudio(){super.prepareAudio();if(!this.audio.kit)this.audio.kit=this.makeKit(this.audio.context);}
 makeKit(context){
  const kit={};let seed=913;
  for(const [note,length] of [[36,.45],[38,.22],[37,.055],[42,.065]]){
   const b=context.createBuffer(1,Math.ceil(context.sampleRate*length),context.sampleRate),data=b.getChannelData(0);let prior=0;
   for(let i=0;i<data.length;i++){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/2147483648-1,t=i/context.sampleRate,attack=Math.min(1,t/.0015),high=noise-prior;prior=noise;
    if(note===36)data[i]=Math.sin(2*Math.PI*(48*t+85*.025*(1-Math.exp(-t/.025))))*Math.exp(-t*13)*attack*.8;
    if(note===38)data[i]=(noise*.55+Math.sin(2*Math.PI*185*t)*.2)*Math.exp(-t*23)*attack;
    if(note===37)data[i]=(Math.sin(2*Math.PI*1750*t)+Math.sin(2*Math.PI*2300*t))*.23*Math.exp(-t*95)*attack;
    if(note===42)data[i]=high*.14*Math.exp(-t*65)*attack;
   }kit[note]=b;
  }return kit;
 }
 schedule(e,time){
  if(e.type!=='note'){super.schedule(e,time);return;}
  const {context,master,kit}=this.audio,volume=e.velocity/127;
  if(e.channel===9){
   const source=context.createBufferSource(),gain=context.createGain();source.buffer=kit[e.midi];gain.gain.value=volume*.7;
   source.connect(gain);gain.connect(master);source.addEventListener('ended',()=>{source.disconnect();gain.disconnect();},{once:true});this.track(source);source.start(time);
  }else if(e.channel===2){
   const source=context.createOscillator(),gain=context.createGain(),end=time+e.duration*this.beatSeconds;source.type='triangle';source.frequency.value=440*2**((e.midi-69)/12);
   gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume*.23,time+.012);gain.gain.exponentialRampToValueAtTime(.0001,end);
   source.connect(gain);gain.connect(master);source.addEventListener('ended',()=>{source.disconnect();gain.disconnect();},{once:true});this.track(source);source.start(time);source.stop(end+.02);
  }else this.pianoNote(e.midi,time,e.duration*this.beatSeconds,volume);
 }
}
globalThis.RnbPlayer=RnbPlayer;
if(typeof module!=='undefined')module.exports=RnbPlayer;
