'use strict';
(() => {
 const M=RnbMusic,$=id=>document.getElementById(id);
 const defaults={key:0,register:3,tempo:78,volume:75,mode:'together',repeats:2,gap:4,movement:'stay',drums:'auto'};
 const settings={...defaults};
 try{const s=JSON.parse(localStorage.getItem('rnb-original-settings')||'{}');for(const [k,values] of Object.entries({key:M.names.map((_,i)=>i),register:[2,3,4],mode:['together','echo','backing'],repeats:[1,2,3,4],gap:[0,2,4],movement:['stay','rise'],drums:['auto','pocket','swing','halftime','off']}))if(values.includes(s[k]))settings[k]=s[k];for(const [k,min,max] of [['tempo',50,120],['volume',0,120]])if(Number.isFinite(s[k]))settings[k]=Math.max(min,Math.min(max,s[k]));}catch{}
 let study=M.studies[0],arrangement,phaseStart=4,total=0,melodyEnds=0,breathEnds=0,activeShift=0;
 function save(){try{localStorage.setItem('rnb-original-settings',JSON.stringify(settings));}catch{}}
 function clear(){if(arrangement){$('range-label').textContent=`Melody ${M.noteName(arrangement.low)}–${M.noteName(arrangement.high+(settings.movement==='rise'?2:0))}${settings.movement==='rise'?' across all keys':''}`;document.querySelectorAll('.chord strong').forEach((el,i)=>el.textContent=arrangement.chords[i].name);}document.querySelectorAll('.active').forEach(e=>e.classList.remove('active'));$('note-label').textContent='Ready';$('beat-indicator').textContent='';$('breath-cue').textContent='Breathe in the marked rests. Keep the phrases light.';const line=$('playhead');if(line)line.setAttribute('visibility','hidden');}
 const player=new RnbPlayer({sound:Sound,
  createAudio(){const context=new (window.AudioContext||window.webkitAudioContext)(),master=context.createGain(),limiter=context.createDynamicsCompressor();master.gain.value=settings.volume/100;limiter.threshold.value=-12;master.connect(limiter);limiter.connect(context.destination);return {context,master,piano:new SamplePiano(context,master)};},
  onState(state){
   $('play').textContent=state==='loading'?'■ Cancel loading':state==='playing'?'■ Stop':'▶ Play exercise';$('error').hidden=state!=='error';
   if(state==='loading')$('status').textContent='Loading piano…';if(state==='playing')$('status').textContent='Count in';
   if(['idle','error','complete','interrupted'].includes(state)){clear();$('status').textContent=state==='complete'?'Practice complete':state==='interrupted'?'Audio paused · tap Play to restart':state==='error'?'Audio unavailable':'Ready to sing';$('session-progress').value=state==='complete'?1:0;}
   if(state==='error')$('error').textContent='The piano could not load or play. Check your connection and try Reset sound.';
  },
  onEvent(e){
   if(e.type==='phase'){phaseStart=e.beat;activeShift=e.shift;const action=e.pass==='listen'?'Listen':e.pass==='sing'?'Your turn':settings.mode==='backing'?'Sing over the backing':'Sing with the piano';$('status').textContent=`${action} · round ${e.round}/${settings.repeats}${e.keys>1?' · key '+e.keyIndex+'/'+e.keys:''}`;const low=arrangement.low+activeShift,high=arrangement.high+activeShift;$('range-label').textContent=`Now ${M.noteName(low)}–${M.noteName(high)}`;}
   if(e.type==='harmony'){document.querySelectorAll('.chord').forEach((el,i)=>{el.classList.toggle('active',i===e.bar);if(i===e.bar)el.querySelector('strong').textContent=e.name;});}
   if(e.type==='melody'){document.querySelectorAll('#melody .note').forEach(el=>el.classList.toggle('active',Number(el.dataset.beat)===e.chartBeat));document.querySelectorAll('.breath').forEach(el=>el.classList.remove('active'));$('note-label').textContent=M.noteName(e.midi);$('breath-cue').textContent='Sing gently · breathe in the next gold space.';melodyEnds=e.beat+e.duration;breathEnds=0;}
   if(e.type==='breath'){document.querySelectorAll('#melody .note').forEach(el=>el.classList.remove('active'));document.querySelectorAll('.breath').forEach(el=>el.classList.toggle('active',Number(el.dataset.beat)===e.beat-phaseStart));$('note-label').textContent='Breathe';$('breath-cue').textContent='Breathe now · release the phrase and take an easy breath.';breathEnds=e.beat+e.duration;}
   if(e.type==='beat')$('beat-indicator').textContent=`Beat ${e.number}/4`;
   if(e.type==='count'){$('beat-indicator').textContent=String(e.number);if(e.beat<4)$('status').textContent=`Count in · ${e.number}/4`;}
   if(e.type==='rest'){clear();$('status').textContent='Breathe · next pass coming';}
   if(e.type==='clock'){
    $('session-progress').value=Math.min(1,e.beat/total);const line=$('playhead'),local=e.beat-phaseStart;
    if(line){line.setAttribute('visibility',local>=0&&local<8?'visible':'hidden');const x=24+Math.max(0,Math.min(8,local))/8*600;line.setAttribute('x1',x);line.setAttribute('x2',x);}
    if(e.beat>=melodyEnds){document.querySelectorAll('#melody .note.active').forEach(el=>el.classList.remove('active'));$('note-label').textContent=e.beat<breathEnds?'Breathe':'Rest';}
   }
  }
 });
 function start(){const events=M.timeline(study,settings);total=events.at(-1).beat;phaseStart=4;melodyEnds=4;breathEnds=0;player.start(events,{...settings,metronome:false});}
 function controls(){for(const id of Object.keys(defaults))$(id).value=settings[id];$('tempo-value').textContent=settings.tempo+' BPM';$('volume-value').textContent=settings.volume+'%';}
 function draw(){
  const root=12*(settings.register+1)+settings.key,y=n=>136-(n-root)/12*106;let svg='';
  for(let b=0;b<=8;b++){const x=24+b/8*600;svg+=`<line class="grid" x1="${x}" x2="${x}" y1="16" y2="145"/><text x="${x+4}" y="160">${b<8?b%4+1:''}</text>`;}
  for(const offset of study.mode==='minor'?[0,3,5,7,10,12]:[0,2,4,7,9,12])svg+=`<line class="grid" x1="24" x2="624" y1="${y(root+offset)}" y2="${y(root+offset)}"/>`;
  arrangement.breaths.forEach(b=>{const x=24+b.beat/8*600,w=b.duration/8*600;svg+=`<rect class="breath" data-beat="${b.beat}" x="${x}" y="16" width="${w}" height="129"><title>Breathe for ${b.duration} beats</title></rect><text class="breath-mark" x="${x+w/2}" y="30" text-anchor="middle">’</text>`;});
  arrangement.melody.forEach(n=>{svg+=`<rect class="note" data-beat="${n.beat}" x="${24+n.beat/8*600}" y="${y(n.midi)-4}" width="${Math.max(5,n.duration/8*600-3)}" height="8" rx="4"><title>${M.noteName(n.midi)}, ${n.duration} beats</title></rect>`;});
  $('melody').innerHTML=svg+'<line id="playhead" class="playhead" y1="16" y2="145" x1="24" x2="24" visibility="hidden"/>';
  $('melody').setAttribute('aria-label',`${study.name}, two bars. ${arrangement.melody.map(n=>M.noteName(n.midi)).join(', ')}. Gold spaces mark breathing rests.`);
 }
 function render(){
  arrangement=M.arrange(study,settings.key,settings.register);$('study-title').textContent=study.name;$('study-style').textContent=study.feel;$('study-tip').textContent=study.tip;$('study-number').textContent=`${M.studies.indexOf(study)+1} / 20`;$('study-select').value=study.id;
  $('key').innerHTML=M.names.map((name,i)=>`<option value="${i}">${name} ${study.mode}</option>`).join('');
  const groove=settings.drums==='auto'?study.groove:settings.drums;$('groove-label').textContent=groove==='off'?'Piano + bass':M.grooves[groove].name+' · synchronized';
  $('range-label').textContent=`Melody ${M.noteName(arrangement.low)}–${M.noteName(arrangement.high+(settings.movement==='rise'?2:0))}${settings.movement==='rise'?' across all keys':''}`;
  $('chord-strip').innerHTML=arrangement.chords.map(c=>`<div class="chord"><small>${c.roman}</small><strong>${c.name}</strong></div>`).join('');
  document.querySelectorAll('[data-study]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.study===study.id)));$('download-status').textContent='';draw();controls();clear();
 }
 function route(){player.stop();study=M.studies.find(s=>s.id===location.hash.slice(1))||M.studies[0];settings.tempo=study.tempo;render();}
 $('study-select').innerHTML=M.studies.map((s,i)=>`<option value="${s.id}">${i+1}. ${s.name}</option>`).join('');
 $('study-list').innerHTML=M.studies.map((s,i)=>`<button type="button" data-study="${s.id}"><span class="study-index">${i+1}</span><b>${s.name}</b><small>${s.feel}</small></button>`).join('');
 document.querySelectorAll('[data-study]').forEach(b=>b.onclick=()=>location.hash=b.dataset.study);
 $('study-select').onchange=()=>location.hash=$('study-select').value;
 $('next-study').onclick=()=>location.hash=M.studies[(M.studies.indexOf(study)+1)%20].id;
 $('play').onclick=()=>player.state==='idle'?start():player.stop();$('reset-sound').onclick=()=>{player.resetAudio=true;start();};
 for(const id of ['key','register','mode','drums','movement','repeats','gap','tempo'])$(id).onchange=()=>{const active=player.state!=='idle';player.stop();settings[id]=['key','register','repeats','gap','tempo'].includes(id)?Number($(id).value):$(id).value;save();render();if(active)start();};
 $('tempo').oninput=()=>{$('tempo-value').textContent=$('tempo').value+' BPM';};
 $('volume').oninput=()=>{settings.volume=Number($('volume').value);$('volume-value').textContent=settings.volume+'%';player.setVolume(settings.volume);save();};
 $('download-midi').onclick=()=>{const url=URL.createObjectURL(new Blob([M.midi(study,settings)],{type:'audio/midi'})),a=document.createElement('a');a.href=url;a.download=`rnb-${study.id}-${settings.tempo}bpm.mid`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);$('download-status').textContent='MIDI ready';};
 window.addEventListener('hashchange',route);window.addEventListener('pagehide',()=>player.stop());document.addEventListener('visibilitychange',()=>{if(document.hidden&&player.state!=='idle'){player.stop();$('status').textContent='Paused while away · press Play to restart';}});
 document.addEventListener('keydown',e=>{if(e.code==='Space'&&!e.repeat&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!['BUTTON','INPUT','SELECT','TEXTAREA','A','SUMMARY'].includes(e.target.tagName)){e.preventDefault();$('play').click();}});
 route();
})();
