'use strict';
// A soft, low tick on every button press, close to the iPhone keyboard click.
// It uses its own tiny audio context so it never touches the piano's volume or compressor.
(function(){
 let ac=null,noise=null;
 function setup(){
  if(ac)return ac;
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
  ac=new AC();
  const len=Math.floor(ac.sampleRate*.018);noise=ac.createBuffer(1,len,ac.sampleRate);
  const data=noise.getChannelData(0);
  for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/len,4);
  return ac;
 }
 function tick(){
  if(!setup())return;
  if(ac.state==='suspended')ac.resume();
  const t=ac.currentTime+.002;
  // Short noise burst, centered low and rounded off at the top so it isn't sharp.
  const src=ac.createBufferSource();src.buffer=noise;
  const band=ac.createBiquadFilter();band.type='bandpass';band.frequency.value=1100;band.Q.value=.8;
  const soft=ac.createBiquadFilter();soft.type='lowpass';soft.frequency.value=1800;
  const gain=ac.createGain();gain.gain.value=.22;
  src.connect(band);band.connect(soft);soft.connect(gain);gain.connect(ac.destination);
  // A quiet low body under the noise gives it a muted "tock".
  const body=ac.createOscillator(),bodyGain=ac.createGain();
  body.type='sine';body.frequency.setValueAtTime(520,t);body.frequency.exponentialRampToValueAtTime(340,t+.03);
  bodyGain.gain.setValueAtTime(0,t);bodyGain.gain.linearRampToValueAtTime(.06,t+.002);bodyGain.gain.exponentialRampToValueAtTime(.0001,t+.035);
  body.connect(bodyGain);bodyGain.connect(ac.destination);
  src.start(t);body.start(t);body.stop(t+.04);
  body.onended=()=>{for(const n of [src,band,soft,gain,body,bodyGain])n.disconnect()};
 }
 document.addEventListener('click',ev=>{
  const el=ev.target.closest('button,summary');
  if(!el||el.disabled||el.classList.contains('key'))return;
  tick();
 },true);
})();
