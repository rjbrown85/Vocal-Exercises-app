'use strict';
// Opening animation only. Piano samples load when the user starts playback.
(() => {
 const main=document.querySelector('main'),splash=document.getElementById('splash');
 let dismissed=false;
 function reveal(){
  if(dismissed)return;dismissed=true;
  document.body.classList.remove('booting');
  main.inert=false;splash.classList.add('leaving');
  setTimeout(()=>{splash.hidden=true},500);
 }
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 setTimeout(reveal,reduced?0:850);
 splash.addEventListener('pointerdown',reveal);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')reveal()});
 window.addEventListener('pageshow',e=>{if(e.persisted)reveal()});
 document.getElementById('general-warmups').onclick=()=>{
  document.getElementById('landing').hidden=true;
  document.getElementById('home').hidden=false;
  slideIn('forward');document.getElementById('warmups-title').focus({preventScroll:true});window.scrollTo(0,0);
 };
 document.getElementById('home-back').onclick=()=>{
  document.getElementById('home').hidden=true;
  document.getElementById('landing').hidden=false;
  slideIn('back');document.getElementById('general-warmups').focus({preventScroll:true});window.scrollTo(0,0);
 };
})();

// Training uses the same player, with a brief instruction for each exercise.
document.querySelectorAll('[data-training]').forEach(button=>{
 button.onclick=()=>{
  const e=M.exercises.find(e=>e.bank===button.dataset.training);
  change({bank:e.bank,id:e.id,tempo:120,start:'auto'});
  showPractice();
 };
});
