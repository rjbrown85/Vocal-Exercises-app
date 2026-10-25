/* Continuous pitch reference: one oscillator and envelope per slide phrase. */
(function(root){
function play(ctx,destination,notes,durations,start,tail=0){
 const osc=ctx.createOscillator(),gain=ctx.createGain(),hz=n=>440*2**((n-69)/12);
 osc.type='sine';osc.connect(gain);gain.connect(destination);
 osc.frequency.setValueAtTime(hz(notes[0]),start);
 let time=start;
 for(let i=1;i<notes.length;i++){
  const arrival=time+durations[i-1];
  osc.frequency.setValueAtTime(hz(notes[i-1]),time+durations[i-1]*.2);
  osc.frequency.exponentialRampToValueAtTime(hz(notes[i]),arrival);time=arrival;
 }
 const end=time+durations.at(-1)+tail;
 gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.24,start+.04);
 gain.gain.setValueAtTime(.24,end);gain.gain.linearRampToValueAtTime(0,end+.18);
 osc.start(start);osc.stop(end+.2);
 osc.fadeOut=()=>{const now=ctx.currentTime;gain.gain.cancelScheduledValues(now);gain.gain.setTargetAtTime(0,now,.015);osc.stop(now+.08);};
 osc.addEventListener('ended',()=>{osc.disconnect();gain.disconnect()},{once:true});return osc;
}
const api={play};root.SlideSynth=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
