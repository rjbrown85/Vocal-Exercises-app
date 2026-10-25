// During a gesture, replace repeated sample restarts with one continuous glide.
const tempoScrub={
 session:0,active:false,osc:null,gain:null,clock:null,position:null,guard:null,
 async start(){
  if(this.active)return;
  this.active=true;const session=++this.session;Sound.hold();
  this.clock=running?phraseClock:null;
  this.position=this.clock?(ctx.currentTime-this.clock.base)/this.clock.beat:null;
  if(this.clock)cancel();
  this.guard=token;
  try{
   await initAudio();
   if(!this.active||session!==this.session)return;
   const osc=ctx.createOscillator(),gain=ctx.createGain();
   osc.type='sine';osc.frequency.value=this.frequency(s.tempo);
   gain.gain.setValueAtTime(0,ctx.currentTime);
   gain.gain.linearRampToValueAtTime(.09*s.volume/100,ctx.currentTime+.06);
   osc.connect(gain);gain.connect(master);osc.start();
   this.osc=osc;this.gain=gain;
  }catch{this.end()}
 },
 frequency(tempo){return 160*2**((tempo-40)/100)},
 update(tempo){
  s.tempo=tempo;$('tempo').value=tempo;$('tempoValue').innerHTML=`${tempo} <small>BPM</small>`;save();
  if(this.osc)this.osc.frequency.setTargetAtTime(this.frequency(tempo),ctx.currentTime,.1);
 },
 end(){
  if(!this.active)return;
  this.active=false;
  if(this.osc){
   const osc=this.osc,gain=this.gain,now=ctx.currentTime;
   gain.gain.cancelAndHoldAtTime(now);gain.gain.linearRampToValueAtTime(0,now+.08);
   osc.stop(now+.09);osc.onended=()=>{osc.disconnect();gain.disconnect()};
   this.osc=null;this.gain=null;
  }
  if(this.clock&&running&&token===this.guard){
   runPhrase(this.clock.cue,ctx.currentTime+.04-this.position*(60/s.tempo),this.clock);
  }
  if(!running)Sound.release(600);
  this.clock=null;
 }
};
$('tempo').addEventListener('pointerdown',()=>tempoScrub.start());
window.addEventListener('pointerup',()=>tempoScrub.end());
window.addEventListener('pointercancel',()=>tempoScrub.end());
const tempoKeys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'];
$('tempo').addEventListener('keydown',e=>{if(tempoKeys.includes(e.key))tempoScrub.start()});
$('tempo').addEventListener('keyup',e=>{if(tempoKeys.includes(e.key))tempoScrub.end()});
$('tempo').addEventListener('blur',()=>tempoScrub.end());
window.addEventListener('blur',()=>tempoScrub.end());
document.addEventListener('visibilitychange',()=>{if(document.hidden)tempoScrub.end()});
