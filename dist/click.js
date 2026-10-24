'use strict';
// A soft, short tick on every button press, close to the iPhone keyboard click.
// It uses its own tiny audio context so it never touches the piano's volume or compressor.
(function(){
 let ac=null,noise=null;
 function setup(){
  if(ac)return ac;
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
  ac=new AC();
  const len=Math.floor(ac.sampleRate*.014);noise=ac.createBuffer(1,len,ac.sampleRate);
  const data=noise.getChannelData(0);
  for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/len,5);
  return ac;
 }
 function tick(){
  if(!setup())return;
  if(ac.state==='suspended')ac.resume();
  const t=ac.currentTime+.002;
  const src=ac.createBufferSource();src.buffer=noise;
  const band=ac.createBiquadFilter();band.type='bandpass';band.frequency.value=2600;band.Q.value=.9;
  const gain=ac.createGain();gain.gain.value=.16;
  src.connect(band);band.connect(gain);gain.connect(ac.destination);
  src.start(t);src.onended=()=>{src.disconnect();band.disconnect();gain.disconnect()};
 }
 document.addEventListener('click',ev=>{
  const el=ev.target.closest('button,summary');
  if(!el||el.disabled||el.classList.contains('key'))return;
  tick();
 },true);
})();
