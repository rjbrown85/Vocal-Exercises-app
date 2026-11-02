'use strict';
(() => {
  const M=EtudeMusic, $=id=>document.getElementById(id);
  const defaults={key:0,register:3,tempo:76,volume:80,mode:'together',accompaniment:'held',repeats:2,gap:4,metronome:false};
  let settings={...defaults};
  try {
    const saved=JSON.parse(localStorage.getItem('vocal-etudes-settings')||'{}');
    for(const [key,allowed] of Object.entries({key:M.names.map((_,i)=>i),register:[2,3,4],mode:['together','echo','backing'],accompaniment:['held','broken','pulse'],repeats:[1,2,3,4],gap:[0,2,4]}))if(allowed.includes(saved[key]))settings[key]=saved[key];
    for(const [key,min,max] of [['tempo',50,150],['volume',0,150]])if(Number.isFinite(saved[key]))settings[key]=Math.max(min,Math.min(max,saved[key]));
    settings.metronome=saved.metronome===true;
  } catch{}
  let progression=M.progressions[0],style=M.styles[0],arrangement,phaseStart=4,totalBeats=0;
  let melodyEnds=0,lastRound=1,lastPass='play';
  function save(){try{localStorage.setItem('vocal-etudes-settings',JSON.stringify(settings));}catch{}}
  function clearHighlights(){document.querySelectorAll('.active').forEach(el=>el.classList.remove('active'));$('note-label').textContent='Ready';$('beat-indicator').textContent='';}
  const player=new EtudePlayer({
    sound:Sound,
    createAudio(){
      const context=new (window.AudioContext||window.webkitAudioContext)(),master=context.createGain(),limiter=context.createDynamicsCompressor();
      master.gain.value=settings.volume/100;limiter.threshold.value=-15;master.connect(limiter);limiter.connect(context.destination);
      return {context,master,piano:new SamplePiano(context,master)};
    },
    onState(state){
      $('error').hidden=state!=='error';
      $('play').textContent=state==='loading'?'■ Cancel loading':state==='playing'?'■ Stop':'▶ Play etude';
      if(state==='loading')$('status').textContent='Loading piano…';
      if(state==='playing')$('status').textContent='Count in';
      if(state==='interrupted'){
        clearHighlights();$('status').textContent='Audio paused · tap Play to restart';$('session-progress').value=0;
      }
      if(state==='idle'||state==='error'||state==='complete'){
        clearHighlights();$('status').textContent=state==='complete'?'Practice complete':state==='error'?'Audio unavailable':'Ready to sing';
        $('session-progress').value=state==='complete'?1:0;
      }
      if(state==='error'){$('error').textContent='The piano could not load or play. Check your connection, then press Play to retry.';}
    },
    onEvent(event){
      if(event.type==='phase'){
        phaseStart=event.beat;lastRound=event.round;lastPass=event.pass;
        const action=event.pass==='listen'?'Listen':event.pass==='sing'?'Your turn · chords only':settings.mode==='backing'?'Sing · chords only':'Sing with the melody';
        $('status').textContent=`${action} · round ${lastRound} of ${settings.repeats}`;
      }
      if(event.type==='chord'){
        document.querySelectorAll('.chord').forEach((el,i)=>el.classList.toggle('active',i===event.bar));
      }
      if(event.type==='melody'){
        document.querySelectorAll('#melody .note').forEach(el=>el.classList.toggle('active',Number(el.dataset.beat)===event.beat-phaseStart));
        $('note-label').textContent=M.noteName(event.midi,settings.key);melodyEnds=event.beat+event.duration;
      }
      if(event.type==='beat')$('beat-indicator').textContent=`Beat ${event.number} / 4`;
      if(event.type==='count'){
        $('beat-indicator').textContent=String(event.number);
        if(event.beat<4)$('status').textContent=`Count in · ${event.number} / 4`;
      }
      if(event.type==='rest'){
        clearHighlights();$('status').textContent=lastPass==='listen'?'Breathe · your turn next':`Breathe · round ${lastRound+1} next`;
      }
      if(event.type==='clock'){
        $('session-progress').value=Math.min(1,event.beat/totalBeats);
        if(event.beat>=melodyEnds){document.querySelectorAll('#melody .note.active').forEach(el=>el.classList.remove('active'));$('note-label').textContent='Rest';}
      }
    }
  });
  function start(){
    const events=M.timeline(arrangement,settings.mode,settings.repeats,settings.gap);
    totalBeats=events.at(-1).beat;phaseStart=4;melodyEnds=4;
    player.start(events,settings);
  }
  function renderControls(){
    Object.keys(defaults).forEach(id=>{if(id==='metronome')$(id).checked=settings[id];else $(id).value=settings[id];});
    $('tempo-value').textContent=settings.tempo+' BPM';$('volume-value').textContent=settings.volume+'%';
  }
  function drawMelody(){
    const width=600,left=24,top=24,height=112;
    const low=Math.min(arrangement.low,12*(settings.register+1)+settings.key);
    const high=low+12;
    const y=midi=>top+height-(midi-low)/(high-low)*height;
    let svg='';
    for(let bar=0;bar<4;bar++){
      const x=left+bar*width/4;
      svg+=`<line class="grid" x1="${x}" x2="${x}" y1="16" y2="145"/><text x="${x+5}" y="159">${bar+1}</text>`;
    }
    for(let degree=0;degree<=7;degree++){
      const midi=12*(settings.register+1)+settings.key+M.semitone(degree);
      svg+=`<line class="grid" x1="24" x2="624" y1="${y(midi)}" y2="${y(midi)}"/>`;
    }
    arrangement.melody.forEach(n=>{
      const x=left+n.beat/16*width,w=Math.max(4,n.duration/16*width-3);
      svg+=`<rect class="note" data-beat="${n.beat}" x="${x}" y="${y(n.midi)-4}" width="${w}" height="8" rx="4"><title>${M.noteName(n.midi,settings.key)}, ${n.duration} beats</title></rect>`;
    });
    $('melody').innerHTML=svg;
    $('melody').setAttribute('aria-label',`${style.name}: four bars, ${M.noteName(arrangement.low,settings.key)} to ${M.noteName(arrangement.high,settings.key)}. Wider marks mean longer notes.`);
  }
  function renderStudy(){
    arrangement=M.arrange(progression,style,settings.key,settings.register);
    $('study-title').textContent=style.name;$('study-style').textContent=style.feel;
    $('study-tip').textContent=style.tip;$('study-number').textContent=`${M.styles.indexOf(style)+1} / 10`;
    $('study-select').value=style.id;
    $('range-label').textContent=`${M.names[settings.key]} major · melody ${M.noteName(arrangement.low,settings.key)}–${M.noteName(arrangement.high,settings.key)}`;
    $('chord-strip').innerHTML=arrangement.chords.map(c=>`<div class="chord"><small>${c.roman}</small><strong>${c.name}</strong></div>`).join('');
    document.querySelectorAll('[data-study]').forEach(button=>button.setAttribute('aria-current',String(button.dataset.study===style.id)));
    $('next-study').textContent=M.styles.indexOf(style)===9?'First etude ↻':'Next etude →';
    drawMelody();renderControls();clearHighlights();
  }
  function chooseStudy(next,{focus=false}={}){
    player.stop();style=next;settings.tempo=style.tempo;save();renderStudy();
    if(focus)$('study-title').focus({preventScroll:true});
  }
  function route(){
    player.stop();
    const id=location.hash.slice(1),found=M.progressions.find(p=>p.id===id);
    $('progressions').hidden=Boolean(found);$('studio').hidden=!found;
    if(found){
      progression=found;$('progression-title').textContent=found.label;$('progression-name').textContent=found.name;$('progression-description').textContent=found.mood;
      renderStudy();$('progression-title').focus({preventScroll:true});
    } else $('page-title').focus({preventScroll:true});
    window.scrollTo(0,0);
  }
  $('progression-grid').innerHTML=M.progressions.map((p,i)=>`<button class="progression-card" data-progression="${p.id}" type="button"><span class="number">${String(i+1).padStart(2,'0')} · ${p.name}</span><span class="roman">${p.label}</span><span class="example">${p.degrees.map(d=>M.chordName(d)).join(' · ')}</span><span class="name">10 etudes</span><span class="arrow" aria-hidden="true">↗</span></button>`).join('');
  document.querySelectorAll('[data-progression]').forEach(button=>button.onclick=()=>{location.hash=button.dataset.progression;});
  $('study-list').innerHTML=M.styles.map((s,i)=>`<button type="button" data-study="${s.id}" aria-current="false"><span class="study-index">${String(i+1).padStart(2,'0')}</span><b>${s.name}</b><small>${s.feel}</small></button>`).join('');
  $('study-select').innerHTML=M.styles.map((s,i)=>`<option value="${s.id}">${i+1}. ${s.name} · ${s.feel}</option>`).join('');
  $('study-select').onchange=()=>chooseStudy(M.styles.find(s=>s.id===$('study-select').value));
  document.querySelectorAll('[data-study]').forEach(button=>button.onclick=()=>chooseStudy(M.styles.find(s=>s.id===button.dataset.study)));
  $('key').innerHTML=M.names.map((n,i)=>`<option value="${i}">${n} major</option>`).join('');
  $('back-progressions').onclick=()=>{location.hash='';};
  $('next-study').onclick=()=>chooseStudy(M.styles[(M.styles.indexOf(style)+1)%M.styles.length],{focus:true});
  $('play').onclick=()=>{if(player.state==='idle')start();else player.stop();};
  $('reset-sound').onclick=()=>{player.resetAudio=true;start();};
  const numeric=['key','register','tempo','volume','repeats','gap'];
  ['key','register','mode','accompaniment','repeats','gap','tempo'].forEach(id=>{
    $(id).addEventListener('change',()=>{
      const resume=player.state!=='idle';player.stop();
      settings[id]=numeric.includes(id)?Number($(id).value):$(id).value;save();renderStudy();
      if(resume)start();
    });
  });
  $('tempo').addEventListener('input',()=>{$('tempo-value').textContent=$('tempo').value+' BPM';});
  $('volume').addEventListener('input',()=>{settings.volume=Number($('volume').value);$('volume-value').textContent=settings.volume+'%';player.setVolume(settings.volume);save();});
  $('metronome').onchange=()=>{settings.metronome=$('metronome').checked;if(player.settings)player.settings.metronome=settings.metronome;save();};
  document.addEventListener('keydown',event=>{
    if(event.code==='Space'&&!event.repeat&&!$('studio').hidden&&!event.altKey&&!event.ctrlKey&&!event.metaKey&&!['BUTTON','INPUT','SELECT','TEXTAREA','A','SUMMARY'].includes(event.target.tagName)){
      event.preventDefault();$('play').click();
    }
  });
  window.addEventListener('hashchange',route);
  window.addEventListener('pagehide',()=>player.stop());
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&player.state!=='idle'){player.stop();$('status').textContent='Paused while away · press Play to restart';}});
  renderControls();route();
})();
