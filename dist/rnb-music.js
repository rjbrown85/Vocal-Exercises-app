'use strict';
// Original practice phrases. PJVI references inform technique, not note transcriptions.
(() => {
 const names=['C','D♭','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
 const studies=[
  ['easy-three','Easy three','Major pentatonic',78,'pocket','major','Sing “oo”. Keep each return to the home note relaxed.',[[0,1],[2,.5],[4,.5],[2,1],[null,1]],[[4,.5],[2,.5],[0,2],[null,1]]],
  ['gentle-answer','Gentle answer','Major pentatonic',82,'pocket','major','Sing “ho”. Let the second phrase answer the first.',[[0,.5],[4,.5],[7,1],[4,1],[null,1]],[[2,1],[4,.5],[2,.5],[0,1],[null,1]]],
  ['held-to-run','Hold, then move','Major pentatonic',76,'halftime','major','Hold “oo”, then keep the little run on the same vowel.',[[4,1.5],[7,.5],[4,.5],[2,.5],[null,1]],[[4,.5],[2,.5],[0,1],[null,2]]],
  ['offbeat-entry','Offbeat entry','Rhythm & phrasing',84,'pocket','major','Count the silent opening beat. Enter lightly on “da”.',[[null,.5],[0,.5],[2,1],[4,1],[null,1]],[[null,.5],[4,.5],[2,.5],[0,1.5],[null,1]]],
  ['small-loop','Small loop','Major pentatonic',88,'swing','major','Sing “doo”. Give repeated notes a gentle pulse.',[[2,.5],[4,.5],[2,.5],[0,.5],[2,1],[null,1]],[[4,.5],[7,.5],[4,.5],[2,.5],[0,1],[null,1]]],
  ['minor-three','Minor three','Minor pentatonic',76,'pocket','minor','Sing “noo”. Settle the minor third before moving on.',[[0,1],[3,.5],[5,.5],[3,1],[null,1]],[[5,.5],[3,.5],[0,2],[null,1]]],
  ['minor-fall','Minor falling line','Minor pentatonic',80,'halftime','minor','Sing one connected “ah” through each falling figure.',[[7,1],[5,.5],[3,.5],[0,1],[null,1]],[[5,1],[3,.5],[5,.5],[3,1],[null,1]]],
  ['fifth-return','Fifth and return','Intervals',80,'pocket','major','Sing “ya”. Place the fifth gently, then walk down.',[[0,.5],[7,1],[4,.5],[2,1],[null,1]],[[4,1],[7,.5],[4,.5],[0,1],[null,1]]],
  ['soul-sixth','Soul sixth','Major pentatonic',74,'swing','major','Sing “oo”. Reach the sixth with an easy, even tone.',[[4,.5],[7,.5],[9,1],[7,1],[null,1]],[[4,.5],[2,.5],[4,1],[0,1],[null,1]]],
  ['short-reply','Short reply','Space & timing',86,'halftime','minor','Sing “na”. Leave the full silence before the reply.',[[0,.5],[3,.5],[5,1],[null,2]],[[7,.5],[5,.5],[3,.5],[0,.5],[3,1],[null,1]]],
  ['turn-above','Turn above','Small ornaments',78,'swing','major','Sing “oo”. Keep the four quick notes small and even.',[[4,1],[7,.25],[4,.25],[2,.25],[4,.25],[2,1],[null,1]],[[0,1],[2,.5],[4,.5],[0,1],[null,1]]],
  ['turn-below','Turn below','Small ornaments',76,'pocket','minor','Sing “noo”. Let the quick turn flow without a new breath.',[[5,1],[3,.25],[0,.25],[3,.25],[5,.25],[3,1],[null,1]],[[7,.5],[5,.5],[3,1],[0,1],[null,1]]],
  ['two-peaks','Two small peaks','Major pentatonic',88,'pocket','major','Sing “da”. Give both little arches the same shape.',[[0,.5],[2,.5],[4,.5],[2,.5],[0,1],[null,1]],[[4,.5],[7,.5],[9,.5],[7,.5],[4,1],[null,1]]],
  ['syncopated-home','Syncopated home','Rhythm & phrasing',90,'pocket','major','Sing “doo”. Hold across the beat without pushing.',[[0,.5],[2,1],[4,.5],[7,1],[null,1]],[[4,.5],[2,1],[0,1.5],[null,1]]],
  ['minor-neighbor','Minor neighbor','Minor pentatonic',82,'swing','minor','Sing “ah”. Keep the repeated neighbor figure smooth.',[[3,.5],[5,.5],[3,1],[0,1],[null,1]],[[7,.5],[10,.5],[7,.5],[5,.5],[3,1],[null,1]]],
  ['octave-descent','Octave descent','Range & release',72,'halftime','major','Choose a comfortable key. Sing “oo” down from the octave.',[[12,1],[9,.5],[7,.5],[4,1],[null,1]],[[7,.5],[4,.5],[2,.5],[0,1.5],[null,1]]],
  ['six-note-ribbon','Six-note line','Flowing eighths',78,'swing','major','Keep one “oo” vowel through the six even notes.',[[0,.5],[2,.5],[4,.5],[7,.5],[9,.5],[7,.5],[null,1]],[[4,.5],[7,.5],[4,.5],[2,.5],[0,1],[null,1]]],
  ['minor-ribbon','Minor six-note line','Flowing eighths',76,'pocket','minor','Sing “noo”. Keep the descent connected and unhurried.',[[10,.5],[7,.5],[5,.5],[3,.5],[5,.5],[7,.5],[null,1]],[[5,.5],[3,.5],[0,1],[3,1],[null,1]]],
  ['quick-release','Quick release','Short sixteenth runs',72,'pocket','major','Start slowly. Release the quick notes into the long home note.',[[7,1],[9,.25],[7,.25],[4,.25],[2,.25],[4,1],[null,1]],[[2,.5],[4,.5],[2,.25],[0,1.75],[null,1]]],
  ['soul-conversation','Soul conversation','Phrase variation',80,'swing','minor','Sing “ah”. Shape two different replies, then take an easy breath.',[[null,.5],[3,.5],[5,.5],[7,1],[5,.5],[null,1]],[[3,.5],[5,.25],[3,.25],[0,1],[3,1],[null,1]]]
 ].map(([id,name,feel,tempo,groove,mode,tip,...bars])=>({id,name,feel,tempo,groove,mode,tip,bars}));
 const grooves={pocket:{name:'R&B pocket',swing:.5,kick:[0,1.75,2.5,4,4.5,6.5],snare:[1,3,5,7]},swing:{name:'Neo-soul swing',swing:.58,kick:[0,2.5,4,5.5,6.75],rim:[1,3,5,7]},halftime:{name:'Half-time',swing:.5,kick:[0,1.5,4,5.5,7.25],snare:[2,6]}};
 function swingBeat(beat,groove){const g=grooves[groove];return beat+(g&&Math.round(beat*2)%2===1&&Math.abs(beat*2-Math.round(beat*2))<.001?(g.swing-.5):0);}
 function noteName(midi){return names[(midi%12+12)%12]+(Math.floor(midi/12)-1);}
 function arrange(study,key=0,register=3){
  const root=12*(register+1)+key,melody=[],breaths=[];
  study.bars.forEach((bar,b)=>{let beat=b*4;bar.forEach(([offset,duration])=>{if(offset===null)breaths.push({beat,duration,bar:b});else melody.push({beat,duration,midi:root+offset,offset,bar:b});beat+=duration;});});
  const minor=study.mode==='minor';
  const chords=[{beat:0,bar:0,roman:minor?'i7':'Imaj7',name:names[key]+(minor?'m7':'maj7'),notes:(minor?[0,3,7,10]:[0,4,7,11]).map(n=>48+key+n),bass:36+key},
   {beat:4,bar:1,roman:minor?'iv7':'IVmaj7',name:names[(key+5)%12]+(minor?'m7':'maj7'),notes:(minor?[0,3,5,8]:[0,4,5,9]).map(n=>48+key+n),bass:36+(key+5)%12}];
  return {study,melody,breaths,chords,beats:8,low:Math.min(...melody.map(n=>n.midi)),high:Math.max(...melody.map(n=>n.midi))};
 }
 function timeline(study,settings){
  const {key=0,register=3,mode='together',repeats=2,gap=4,movement='stay',drums='auto'}=settings;
  const groove=drums==='auto'?study.groove:drums,events=[],route=movement==='rise'?[0,1,2,1,0]:[0];let cursor=4;
  const addNote=(beat,duration,midi,channel,velocity)=>events.push({type:'note',beat,duration,midi,channel,velocity});
  for(let beat=0;beat<4;beat++)events.push({type:'count',beat,number:beat+1});
  route.forEach((shift,ki)=>{
   const a=arrange(study,key,register);const passes=mode==='echo'?['listen','sing']:['play'];
   for(let round=1;round<=repeats;round++)passes.forEach((pass,pi)=>{
    const start=cursor;events.push({type:'phase',beat:start,pass,round,shift,keyIndex:ki+1,keys:route.length});
    const timing=beat=>groove==='swing'?swingBeat(beat,groove):beat;
    a.melody.forEach(n=>{
     const at=timing(n.beat),end=timing(n.beat+n.duration),duration=end-at;
     events.push({...n,type:'melody',beat:start+at,chartBeat:n.beat,midi:n.midi+shift,duration,audible:false});
     if(mode!=='backing'&&pass!=='sing')addNote(start+at,duration*.92,n.midi+shift,0,86);
    });
    a.breaths.forEach(b=>events.push({...b,type:'breath',beat:start+timing(b.beat),duration:timing(b.beat+b.duration)-timing(b.beat)}));
    a.chords.forEach(c=>{
     events.push({...c,type:'harmony',beat:start+c.beat,name:noteName(c.bass+shift).replace(/\d/,'')+(study.mode==='minor'?'m7':'maj7')});
     for(const offset of [0,2])c.notes.forEach(n=>addNote(start+c.beat+offset,1.6,n+shift,1,36));
     addNote(start+c.beat,1.7,c.bass+shift,2,64);addNote(start+c.beat+2.5,1.2,c.bass+shift,2,52);
    });
    const g=grooves[groove];if(g){
     for(const [instrument,note] of [['kick',36],['snare',38],['rim',37]])for(const beat of g[instrument]||[])addNote(start+timing(beat),.1,note,9,instrument==='kick'?92:66);
     for(let beat=0;beat<8;beat+=.5)addNote(start+timing(beat),.08,42,9,beat%1?38:53);
    }
    for(let beat=0;beat<8;beat++)events.push({type:'beat',beat:start+beat,number:beat%4+1});
    cursor+=8;
    if(pi<passes.length-1||round<repeats||ki<route.length-1){events.push({type:'rest',beat:cursor});for(let b=0;b<gap;b++)events.push({type:'count',beat:cursor+b,number:b+1});cursor+=gap;}
   });
  });
  events.push({type:'end',beat:cursor});return events.sort((a,b)=>a.beat-b.beat);
 }
 function midi(study,settings){
  const events=timeline(study,settings),tempo=Math.round(60000000/settings.tempo),ppq=480;
  const vlq=n=>{const bytes=[n&127];while(n>>=7)bytes.unshift((n&127)|128);return bytes;};
  const track=[0,255,81,3,tempo>>16&255,tempo>>8&255,tempo&255,0,255,88,4,4,2,24,8,0,0xc0,0,0,0xc1,0,0,0xc2,32];
  const notes=[];for(const e of events){
   if(e.type==='note'){const tick=Math.round(e.beat*ppq);notes.push({tick,data:[0x90+e.channel,e.midi,e.velocity]},{tick:Math.round((e.beat+e.duration)*ppq),data:[0x80+e.channel,e.midi,0]});}
   if(e.type==='count'){const tick=Math.round(e.beat*ppq);notes.push({tick,data:[0x99,37,45]},{tick:tick+30,data:[0x89,37,0]});}
  }
  notes.sort((a,b)=>a.tick-b.tick||a.data[0]-b.data[0]);let last=0;
  for(const e of notes){track.push(...vlq(e.tick-last),...e.data);last=e.tick;}
  track.push(...vlq(Math.max(0,Math.round(events.at(-1).beat*ppq)-last)),255,47,0);
  const n=track.length;return new Uint8Array([77,84,104,100,0,0,0,6,0,0,0,1,1,224,77,84,114,107,n>>>24&255,n>>>16&255,n>>>8&255,n&255,...track]);
 }
 const api={studies,grooves,names,noteName,arrange,timeline,midi,swingBeat};globalThis.RnbMusic=api;if(typeof module!=='undefined')module.exports=api;
})();
