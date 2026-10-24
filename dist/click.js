'use strict';
// A soft, low synth blip on button presses.
// It uses its own tiny audio context so it never touches the piano's volume or compressor.
// Clicks stay quiet while the piano is sounding, so on iPhone they follow the silent switch.
(function(){
 let ac=null;
 // Buttons that play a piano note already give their own feedback.
 const pianoButtons=['play','low','high'];
 function tick(){
  if(!ac){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ac=new AC()}
  if(ac.state==='suspended')ac.resume();
  const t=ac.currentTime+.003;
  const low=ac.createOscillator(),high=ac.createOscillator(),highGain=ac.createGain();
  low.type='triangle';low.frequency.setValueAtTime(260,t);low.frequency.exponentialRampToValueAtTime(180,t+.07);
  high.type='sine';high.frequency.setValueAtTime(520,t);high.frequency.exponentialRampToValueAtTime(360,t+.05);
  highGain.gain.value=.3;
  const soft=ac.createBiquadFilter();soft.type='lowpass';soft.frequency.value=900;soft.Q.value=.5;
  const gain=ac.createGain();
  gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.16,t+.004);gain.gain.exponentialRampToValueAtTime(.0001,t+.09);
  low.connect(soft);high.connect(highGain);highGain.connect(soft);soft.connect(gain);gain.connect(ac.destination);
  low.start(t);high.start(t);low.stop(t+.1);high.stop(t+.1);
  low.onended=()=>{for(const n of [low,high,highGain,soft,gain])n.disconnect()};
 }
 document.addEventListener('click',ev=>{
  const el=ev.target.closest('button,summary');
  if(!el||el.disabled||el.classList.contains('key')||pianoButtons.includes(el.id))return;
  if(typeof Sound!=='undefined'&&Sound.active)return;
  tick();
 },true);
})();
