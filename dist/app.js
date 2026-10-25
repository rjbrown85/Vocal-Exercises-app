'use strict';
const $=id=>document.getElementById(id),M=Vocal;
const defaults={bank:'fundamentals',id:'f1',low:43,high:72,preset:'baritone',direction:'back',tempo:120,rhythm:'original',playback:'together',scale:'auto',start:'auto',repeats:1,gap:0,volume:100,metronome:false,flowVersion:3};
let s={...defaults};try{const saved=JSON.parse(localStorage.getItem('vocal-paper-v1')||'{}');s={...s,...saved,flowVersion:saved.flowVersion}}catch{}
// Migrate the old default, while preserving deliberate volume choices (including mute).
if(s.volumeVersion!==1){if(s.volume===65)s.volume=100;s.volumeVersion=1;}
s.voiceType=s.voiceType==='tenor'||s.preset==='tenor'?'tenor':'baritone';
s.rangeProfiles=s.rangeProfiles&&typeof s.rangeProfiles==='object'&&!Array.isArray(s.rangeProfiles)?s.rangeProfiles:{};
if(s.rangeVersion!==1){s.rangeProfiles={};if(!M.trainingBanks[s.bank])s.rangeProfiles['general:'+s.voiceType]=M.storedRange('general',s.voiceType,s);s.rangeVersion=1;}
s.breathClicks=s.breathClicks!==false;
Object.assign(s,M.storedRange('general',s.voiceType,s.rangeProfiles['general:'+s.voiceType]));
// Apply the shorter breathing default once to existing saved sessions.
if(s.flowVersion!==3){s.gap=0;s.flowVersion=3}
if(s.directionVersion!==1){s.direction='back';s.directionVersion=1}
s.metronome=Boolean(s.metronome);
s.bank='fundamentals';s.id='f1';s.start='auto';s.tempo=120;
if(!M.exercises.some(e=>e.id===s.id&&e.bank===s.bank))s={...defaults};
for(const [k,min,max] of [['low',36,83],['high',37,84],['tempo',40,240],['volume',0,250],['gap',0,6],['repeats',1,4]])s[k]=Math.min(max,Math.max(min,Number.isFinite(Number(s[k]))?Number(s[k]):defaults[k]));
if(s.low>=s.high){s.low=43;s.high=72}
let phraseClock=null,piano,metroGain,starting=false,ctx,master,voices=[],timers=[],running=false,token=0,pending=false,roots=[],pos=0,repeat=0,rootNote=48,holding=false,awake=null;
const exercise=()=>M.exercises.find(e=>e.id===s.id);
const scale=()=>s.bank==='fundamentals'?s.scale:'auto';
const isTimed=()=>Boolean(exercise().timer);
const bound=()=>isTimed()?{min:0,max:0}:M.bounds(exercise(),s.low,s.high,scale());
let breathRunner=null;
function rememberRange(){s.rangeProfiles[M.rangeGroup(s.bank)+':'+s.voiceType]={low:s.low,high:s.high,preset:s.preset};}
function selectBank(bank){
 rememberRange();const e=M.exercises.find(e=>e.bank===bank);
 change({bank,id:e.id,tempo:120,start:'auto',...M.storedRange(bank,s.voiceType,s.rangeProfiles[M.rangeGroup(bank)+':'+s.voiceType])});
 showPractice();
}
function choosePreset(preset){
 if(preset==='custom'){change({preset});return;}
 rememberRange();s.voiceType=preset;change({...M.presetRange(s.bank,preset),start:'auto'});
}
function refreshMetronome(){
 const enabled=isTimed()?s.breathClicks:s.metronome;
 $('metronome').setAttribute('aria-pressed',enabled);$('metronome').textContent=(enabled?'● ':'○ ')+(isTimed()?'Clicks':'Metronome');
 if(metroGain)metroGain.gain.setTargetAtTime(enabled?.32:0,ctx.currentTime,.01);
}
function showBreathFrame(state){
 const label=state.done?'Complete':state.label;if($('breath-phase').textContent!==label)$('breath-phase').textContent=label;
 $('breath-count').textContent=state.done?'✓':exercise().timer.unit==='seconds'?Math.ceil(state.remaining)+'s':'Beat '+state.beat;
 $('breath-detail').textContent=state.done?'Breathe normally':exercise().timer.unit==='beats'?'Bar '+state.bar+' / '+state.bars:'Seconds remaining';
 $('breath-progress').value=state.done?1:state.progress;
 $('breath-cycle').textContent='Round '+state.cycle+' / '+exercise().timer.cycles;
}
function prepareBreath(){showBreathFrame(BreathClock.frame(exercise().timer,0));}
function startBreath(){
 if(!breathRunner)breathRunner=new BreathClock.Runner(exercise().timer,{tempo:s.tempo,now:()=>ctx.currentTime,every:fn=>setInterval(fn,25),clear:id=>clearInterval(id),click:()=>{if(s.breathClicks)clickBeat(ctx.currentTime)},update:showBreathFrame,finish:()=>{running=false;cancel();Sound.release(300);$('play').textContent='▶ AGAIN';release();}});
 phraseClock=null;breathRunner.start();
}

function save(){rememberRange();try{localStorage.setItem('vocal-paper-v1',JSON.stringify(s))}catch{}}
async function initAudio(loadPiano=true){
 if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=s.volume/100;const compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-15;master.connect(compressor);compressor.connect(ctx.destination);piano=new SamplePiano(ctx,master);metroGain=ctx.createGain();metroGain.gain.value=s.metronome?.32:0;metroGain.connect(master)}
 refreshMetronome();await ctx.resume();
 if(loadPiano&&piano.buffers.size!==17){$('play').disabled=true;$('play').textContent='LOADING…';try{await piano.load();$('message').textContent=''}finally{$('play').disabled=bound().min>bound().max;$('play').textContent=running?'Ⅱ PAUSE':'▶ PLAY'}}
}
function tone(n,time,duration,velocity=.55,release=.28,offset=0){if(!ctx)return;const source=piano.play(n,time,duration,velocity,release,offset);voices.push(source);source.addEventListener('ended',()=>{voices=voices.filter(v=>v!==source)},{once:true})}
function clickBeat(time){
 const click=ctx.createOscillator(),gain=ctx.createGain();click.type='sine';click.frequency.value=1200;
 gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(.3,time+.002);gain.gain.exponentialRampToValueAtTime(.0001,time+.045);
 click.connect(gain);gain.connect(metroGain);click.start(time);click.stop(time+.05);voices.push(click);
 click.onended=()=>{click.disconnect();gain.disconnect();voices=voices.filter(v=>v!==click)};
}
function later(seconds,fn,t=token){const id=setTimeout(()=>{timers=timers.filter(timer=>timer!==id);if(t===token)fn()},Math.max(0,seconds*1000));timers.push(id)}
function cancel(){token++;timers.forEach(clearTimeout);timers=[];voices.forEach(v=>{try{if(v.fadeOut)v.fadeOut();else v.stop()}catch{}});voices=[];highlight(null);}
function highlight(n,index=-1){if(exercise().groups&&index>=0)drawContour(index);document.querySelectorAll('.key').forEach(el=>el.classList.toggle('active',Number(el.dataset.note)===n));document.querySelectorAll('#contour circle').forEach((el,i)=>{el.setAttribute('fill',Number(el.dataset.index??i)===index?'#20201c':'#fffdf6');el.setAttribute('r',Number(el.dataset.index??i)===index?'7':'4.5')});$('pitchLabel').textContent=n===null?'—':M.note(n)}
function keyboard(){const min=Math.max(36,Math.min(s.low,rootNote)),max=Math.min(84,Math.max(s.high,rootNote+12));let whites=[];for(let n=min;n<=max;n++)if(![1,3,6,8,10].includes(n%12))whites.push(n);if(!whites.length)return;$('keyboard').replaceChildren();for(const n of whites){const b=document.createElement('button');b.className='key';b.dataset.note=n;b.setAttribute('aria-label',`Play ${M.note(n)}`);b.innerHTML=`<span>${M.note(n)}</span>`;b.onclick=()=>preview(n);$('keyboard').append(b)}for(let n=whites[0]+1;n<whites.at(-1);n++){if(![1,3,6,8,10].includes(n%12))continue;const before=whites.filter(w=>w<n).length,b=document.createElement('button');b.className='key black';b.dataset.note=n;b.style.width=`${68/whites.length}%`;b.style.left=`${(before-.34)*100/whites.length}%`;b.setAttribute('aria-label',`Play ${M.note(n)}`);b.onclick=()=>preview(n);$('keyboard').append(b)}}
async function preview(n){Sound.keep(1500);try{await initAudio();tone(n,ctx.currentTime,.65);if(!running){highlight(n);setTimeout(()=>{if(!running)highlight(null)},700)}}catch{$('message').textContent='Piano could not load. Check your connection and try again.'}}
function drawContour(activeIndex=0){if(isTimed())return;const e=exercise(),all=M.offsets(e,scale());let first=0,last=all.length;if(e.groups){const group=e.groupEnds.findIndex(end=>end>=activeIndex);first=group>0?e.groupEnds[group-1]+1:0;last=e.groupEnds[Math.max(0,group)]+1;}const ns=all.slice(first,last),lo=Math.min(...ns),hi=Math.max(...ns),points=ns.map((n,i)=>[14+i*492/Math.max(1,ns.length-1),85-(n-lo)*65/Math.max(1,hi-lo)]);$('contour').innerHTML=`<path d="M14 94H506" stroke="#20201c" stroke-opacity=".2" stroke-dasharray="3 5"/><polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#20201c" stroke-width="2.5"/>${points.map(([x,y],i)=>`<circle data-index="${first+i}" cx="${x}" cy="${y}" r="4.5" fill="#fffdf6" stroke="#20201c" stroke-width="2"/>`).join('')}`;}
function resetRoute(){if(isTimed()){roots=[0];prepareBreath();return;}const b=bound();roots=M.route(b.min,b.max,s.direction,s.start==='auto'?undefined:Number(s.start));pos=0;repeat=0;rootNote=roots[0]??b.min;updateKey();keyboard()}
function updateKey(){$('next-key').disabled=isTimed()||pos>=roots.length-1;const mode=scale()==='auto'?exercise().scale:scale();$('keyLabel').textContent=M.note(rootNote).replace(/\d+$/,'')+' '+(exercise().scaleLabel||mode);$('progress').textContent=roots.length?`${pos+1} / ${roots.length}`:'—';}
function render(){const e=exercise(),training=M.trainingBanks[s.bank];const timed=isTimed();$('practice').classList.toggle('is-timed',timed);$('practice').classList.toggle('seconds-timer',timed&&e.timer.unit==='seconds');$('breath-visual').hidden=!timed;$('training-guidance').hidden=!(training||e.groups||['intervals','rock','agility','pentatonic','major-runs','other-scales'].includes(s.bank));$('exercise-guidance').textContent=(training||e.groups||['intervals','rock','agility','pentatonic','major-runs','other-scales'].includes(s.bank))?e.hint:'';$('bank-guidance').textContent=training?.tip||'';document.querySelector('.category-icon use').setAttribute('href','#notes-'+(training?.icon||({intervals:'fundamentals',rock:'blues',pentatonic:'rnb','major-runs':'fundamentals','other-scales':'jazz'}[s.bank])||s.bank));document.documentElement.dataset.bank=s.bank;document.documentElement.style.setProperty('--accent',training?.color||{fundamentals:'#f5bc96',blues:'#92cefb',rnb:'#fceda3',jazz:'#c8b1ed',pop:'#f2a5ce',agility:'#a9dfb5',intervals:'#9bded5',rock:'#f2a189',pentatonic:'#e7c76c','major-runs':'#a7c9ef','other-scales':'#bdb0ed'}[s.bank]);document.querySelectorAll('.banks button[data-bank]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.bank===s.bank));const list=M.exercises.filter(x=>x.bank===s.bank);$('exercise').innerHTML=list.map(x=>`<option value="${x.id}">${x.name}</option>`).join('');$('exercise').value=s.id;$('category-title').textContent=training?.name||document.querySelector('.banks [data-bank="'+s.bank+'"] b').textContent;
for(const k of ['low','high'])$(k).textContent=M.note(s[k]);document.querySelectorAll('[data-range]').forEach(button=>{const k=button.dataset.range,v=s[k]+Number(button.dataset.step);button.disabled=v<36||v>M.rangeLimit(s.bank)||(k==='low'?v>=s.high:v<=s.low);});document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.preset===s.preset));document.querySelectorAll('[data-direction]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.direction===s.direction));for(const k of ['tempo','rhythm','playback','scale','repeats','gap','volume'])$(k).value=s[k];refreshMetronome();$('tempoValue').innerHTML=`${s.tempo} <small>BPM</small>`;$('scale').disabled=s.bank!=='fundamentals';
const b=bound();$('start').innerHTML='<option value="auto">Auto</option>'+Array.from({length:Math.max(0,b.max-b.min+1)},(_,i)=>`<option value="${b.min+i}">${M.note(b.min+i)}</option>`).join('');if(s.start!=='auto'&&(Number(s.start)<b.min||Number(s.start)>b.max))s.start='auto';$('start').value=s.start;const valid=b.min<=b.max;$('play').disabled=!valid;$('message').textContent=!valid?'Widen your range to play this exercise.':pending?'Changes apply after this phrase.':'';if(!running){drawContour();resetRoute();$('pitchLabel').textContent=valid?M.note(rootNote):'—';}$('volumeValue').textContent=s.volume+'%';save();}
function change(values){if(isTimed()||values.id&&M.exercises.find(e=>e.id===values.id)?.timer){if(running)pause();else cancel();breathRunner?.reset();breathRunner=null;}Object.assign(s,values);pending=running;if(!running)$('play').textContent='▶ PLAY';render();if(running&&bound().min>bound().max){pause();$('message').textContent='Widen your range to play this exercise.'}}
async function wake(){try{awake=await navigator.wakeLock?.request('screen')}catch{}}
function release(){awake?.release().catch(()=>{});awake=null}
function pause(){breathRunner?.pause();running=false;cancel();Sound.release(1500);$('play').textContent='▶ PLAY';$('phase').textContent='PAUSED / RESTARTS THIS PHRASE';if(isTimed())$('play').textContent='▶ RESUME';release();if(pending){pending=false;render()}}
function finish(){running=false;cancel();Sound.release(2500);$('play').textContent='▶ AGAIN';$('phase').textContent='ALL DONE. NICELY PLAYED.';release();pos=0;repeat=0;rootNote=roots[0]??rootNote;updateKey()}
async function play(){if(starting)return;if(running){pause();return}if(!roots.length)return;starting=true;Sound.hold();const attempt=token;try{await initAudio(!isTimed());if(attempt!==token||!roots.length||$('practice').hidden)return;running=true;$('play').textContent='Ⅱ PAUSE';$('message').textContent='';wake();if(isTimed())startBreath();else runPhrase(true)}catch{running=false;$('message').textContent='Piano could not load. Check your connection and try again.'}finally{starting=false;if(!running)Sound.release()}}
function runPhrase(cue=false,anchor=null,resume=null){if(!running)return;if(pending&&!resume){pending=false;drawContour();resetRoute();$('message').textContent='';cue=true}const config=resume?.config??{...s},e=resume?.exercise??exercise(),mode=resume?.mode??(scale()==='auto'?e.scale:scale()),notes=M.offsets(e,mode).map(n=>n+rootNote),beat=60/s.tempo,durations=e.degrees.map((_,i)=>config.rhythm==='original'&&e.rhythm?e.rhythm[i]:i===e.degrees.length-1?2:1),t=token,lead=cue?beat*2:0,off=0;let at=lead+off;const base=anchor??ctx.currentTime+.06,echo=config.playback==='echo',gap=config.gap*beat;phraseClock={base,beat,cue,config,exercise:e,mode};const schedule=(seconds,fn,t)=>{const delay=base+seconds-ctx.currentTime;if(delay<=0&&resume)fn();else later(delay,fn,t)};const playNote=(n,start,duration,velocity,release)=>{const elapsed=Math.max(0,ctx.currentTime-start);if(elapsed>=duration+release)return;const releaseElapsed=Math.max(0,elapsed-duration),remaining=Math.max(0,duration-elapsed),level=velocity*Math.pow(.0001/Math.max(.001,velocity*.85),releaseElapsed/release);tone(n,Math.max(start,ctx.currentTime),remaining,level,release-releaseElapsed,elapsed)};updateKey();if(cue){$('phase').textContent='KEY CHORD';for(const interval of (e.chord||[0,mode==='minor'?3:4,7]))playNote(rootNote+interval,base,lead+off+beat*.35,.13,.65)}schedule(at,()=>{$('phase').textContent=echo?'LISTEN':'SING'},t);
const phraseEnd=at+durations.reduce((sum,d,i)=>sum+(d+(e.restAfter?.[i]||0))*beat,0),transition=Math.ceil((phraseEnd-1e-8)/beat)*beat+gap;const timings=[];notes.forEach((n,i)=>{const dur=durations[i]*beat;timings.push(at);const feel=M.articulation(e,i,dur,config.rhythm);if(i===notes.length-1&&!echo){feel.duration=transition-at;feel.release=.18}playNote(n,base+at,feel.duration,feel.velocity,feel.release);schedule(at,()=>highlight(n,i),t);at+=dur+(e.restAfter?.[i]||0)*beat;});schedule(echo?at:transition,()=>highlight(null),t);if(echo){const phraseStart=lead+off,phraseLength=at-phraseStart,echoStart=at+beat;schedule(at,()=>{$('phase').textContent='YOUR TURN IN ONE BEAT'},t);schedule(echoStart,()=>{$('phase').textContent='YOUR TURN'},t);timings.forEach((time,i)=>schedule(echoStart+time-phraseStart,()=>highlight(notes[i],i),t));at=echoStart+phraseLength;schedule(at,()=>highlight(null),t)}schedule(at,()=>{$('phase').textContent='BREATHE'},t);const total=Math.ceil((at-1e-8)/beat)*beat+gap;for(let tick=0;tick<total-1e-8;tick+=beat){if(base+tick>=ctx.currentTime)clickBeat(base+tick);}schedule(total-.08,()=>{if(pending){runPhrase(true,base+total);return}repeat++;if(!holding&&repeat>=s.repeats){repeat=0;if(pos>=roots.length-1){later(.28,finish,t);return}pos++;rootNote=roots[pos];keyboard();runPhrase(true,base+total);return}runPhrase(false,base+total)},t)}
function setTempo(value){
 const tempo=Math.max(40,Math.min(240,Number(value)));if(!Number.isFinite(tempo))return;
 if(typeof isTimed==='function'&&isTimed()){s.tempo=tempo;breathRunner?.setTempo(tempo);$('tempo').value=tempo;$('tempoValue').innerHTML=`${tempo} <small>BPM</small>`;save();return;}
 const clock=phraseClock,now=ctx?.currentTime,position=running&&clock?(now-clock.base)/clock.beat:null;
 if(typeof tempoScrub!=='undefined'&&tempoScrub.active){tempoScrub.update(tempo);return}
 s.tempo=tempo;$('tempo').value=tempo;$('tempoValue').innerHTML=`${tempo} <small>BPM</small>`;save();
 if(position!==null){cancel();runPhrase(clock.cue,now-position*(60/tempo),clock)}
}
function manual(step){if(step>0)nextKey();}
function nextKey(){
 if(isTimed()||pos>=roots.length-1)return;
 if(typeof tempoScrub!=='undefined')tempoScrub.end();
 const was=running;cancel();phraseClock=null;
 if(pending){pending=false;drawContour();resetRoute();}
 if(pos>=roots.length-1){if(was)pause();return;}
 pos++;repeat=0;rootNote=roots[pos];
 keyboard();updateKey();$('message').textContent='';
 if(was)runPhrase(true);else $('pitchLabel').textContent=M.note(rootNote);
}
$('next-key').onclick=nextKey;
document.querySelectorAll('.banks button[data-bank]').forEach(b=>b.onclick=()=>{selectBank(b.dataset.bank)});$('exercise').onchange=()=>{const e=M.exercises.find(e=>e.id===$('exercise').value);change({id:e.id,tempo:e.tempo,start:'auto'})};
document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{choosePreset(b.dataset.preset)});document.querySelectorAll('[data-range]').forEach(b=>b.onclick=()=>{const k=b.dataset.range,v=s[k]+Number(b.dataset.step);if(v<36||v>M.rangeLimit(s.bank)||k==='low'&&v>=s.high||k==='high'&&v<=s.low)return;change({[k]:v,preset:'custom',start:'auto'})});for(const k of ['low','high'])$(k).onclick=()=>preview(s[k]);document.querySelectorAll('[data-direction]').forEach(b=>b.onclick=()=>change({direction:b.dataset.direction,start:'auto'}));$('tempo').oninput=()=>setTempo($('tempo').value);for(const k of ['rhythm','playback','scale','start','repeats','gap'])$(k).oninput=()=>change({[k]:['tempo','repeats','gap'].includes(k)?Number($(k).value):$(k).value});$('metronome').onclick=()=>{if(isTimed())s.breathClicks=!s.breathClicks;else s.metronome=!s.metronome;refreshMetronome();save()};$('volume').oninput=()=>{s.volume=Number($('volume').value);$('volumeValue').textContent=s.volume+'%';if(master)master.gain.setTargetAtTime(s.volume/100,ctx.currentTime,.02);save()};$('play').onclick=play;$('hold').onclick=()=>{holding=!holding;$('hold').setAttribute('aria-pressed',holding);$('hold').textContent=holding?'● Hold Key':'○ Hold Key'};document.addEventListener('keydown',ev=>{if($('practice').hidden)return;if(isTimed()&&ev.code!=='Space')return;if(['INPUT','SELECT','TEXTAREA','BUTTON'].includes(ev.target.tagName))return;if(ev.code==='Space'){ev.preventDefault();if(!ev.repeat)play();return}const keys='awsedftgyhujk',i=keys.indexOf(ev.key.toLowerCase());if(i>=0&&!ev.repeat){const n=rootNote+i;if(n>=s.low&&n<=s.high)preview(n)}});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&running)wake()});window.addEventListener('pagehide',()=>{if(running)pause()});render();

function showPractice(){
 $('landing').hidden=true;
 $('home').hidden=true;$('practice').hidden=false;slideIn('forward');
 $('category-title').focus({preventScroll:true});window.scrollTo(0,0);
}
// Restart a short slide-and-fade on the screen that just appeared.
function slideIn(dir){const m=document.querySelector('main');m.classList.remove('nav-anim');m.dataset.nav=dir;void m.offsetWidth;m.classList.add('nav-anim')}
$('back').onclick=()=>{
 pause();if(typeof tempoScrub!=='undefined')tempoScrub.end();
 breathRunner?.reset();breathRunner=null;$('more').open=false;$('practice').hidden=true;const training=M.trainingBanks[s.bank];$(training?'landing':'home').hidden=false;slideIn('back');
 (training?$('training-'+s.bank):document.querySelector('.banks [data-bank="'+s.bank+'"]')).focus({preventScroll:true});window.scrollTo(0,0);
};
