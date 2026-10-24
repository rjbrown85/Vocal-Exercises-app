'use strict';
// On iPhone, the piano plays even with the silent switch on, while button clicks still follow it.
// While the piano is sounding, the page asks for "playback" audio, which ignores the switch.
// The rest of the time it stays "ambient", which respects the switch.
// Older iOS without navigator.audioSession gets the same effect from a looping silent audio element.
const Sound=(()=>{
 const api=navigator.audioSession;
 const ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 let holding=false,until=0,timer=null,media=false,el=null;
 function set(on){
  if(on===media)return;
  media=on;
  if(api){try{api.type=on?'playback':'ambient'}catch{}return}
  if(!ios)return;
  if(on){
   if(!el){el=new Audio('audio/silence.wav');el.loop=true;el.setAttribute('x-webkit-airplay','deny')}
   el.play().catch(()=>{});
  }else if(el)el.pause();
 }
 function check(){
  clearTimeout(timer);
  const left=until-Date.now();
  if(holding||left>0){set(true);if(!holding)timer=setTimeout(check,left)}
  else set(false);
 }
 if(api)try{api.type='ambient'}catch{}
 return{
  hold(){holding=true;check()},
  keep(ms){until=Math.max(until,Date.now()+ms);check()},
  // Let the piano's last notes ring out, but never switch modes when nothing was playing.
  release(ms=0){const wasOn=holding||media;holding=false;if(wasOn)until=Math.max(until,Date.now()+ms);check()},
  get active(){return media}
 };
})();
