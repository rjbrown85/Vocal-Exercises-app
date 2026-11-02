'use strict';
// Original teaching motifs. References document harmony only, never song melodies.
(() => {
  const scale = [0, 2, 4, 5, 7, 9, 11];
  const romans = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
  const minorScale = [0,2,3,5,7,8,10];
  const names = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
  const spellings = [
    ['C','D','E','F','G','A','B'], ['D♭','E♭','F','G♭','A♭','B♭','C'],
    ['D','E','F♯','G','A','B','C♯'], ['E♭','F','G','A♭','B♭','C','D'],
    ['E','F♯','G♯','A','B','C♯','D♯'], ['F','G','A','B♭','C','D','E'],
    ['F♯','G♯','A♯','B','C♯','D♯','E♯'], ['G','A','B','C','D','E','F♯'],
    ['A♭','B♭','C','D♭','E♭','F','G'], ['A','B','C♯','D','E','F♯','G♯'],
    ['B♭','C','D','E♭','F','G','A'], ['B','C♯','D♯','E','F♯','G♯','A♯']
  ];
  const progressions = [
    {id:'pop', degrees:[0,4,5,3], name:'Classic pop', mood:'A bright start with a softer landing.', source:'omt'},
    {id:'minor-first', degrees:[5,3,0,4], name:'Minor first', mood:'A reflective opening that turns toward major.', source:'omt'},
    {id:'doo-wop', degrees:[0,5,3,4], name:'Doo-wop', mood:'A rounded phrase with a clear return home.', source:'omt'},
    {id:'turnaround', degrees:[0,5,1,4], name:'Gentle turnaround', mood:'A minor ii chord leads into the dominant.', source:'omt'},
    {id:'rising', degrees:[3,4,0,5], name:'Rising pop', mood:'A rising opening, then a quiet minor finish.', source:'omt'},
    {id:'open', degrees:[3,0,4,5], name:'Open circle', mood:'An open major sound with a minor ending.', source:'omt'},
    {id:'hopscotch', degrees:[3,4,5,0], name:'Step and lift', mood:'Two steps upward before returning home.', source:'omt'},
    {id:'folk-rock', degrees:[0,3,4,3], name:'Folk-pop loop', mood:'Three familiar chords across four bars.', source:'willis'},
    {id:'soft-soul', degrees:[1,3,0,4], name:'Soft soul', mood:'Start on ii, then open into major chords.', source:'willis'},
    {id:'wide-pop', degrees:[0,3,5,4], name:'Wide-open pop', mood:'A major opening with a brief minor turn.', source:'kaine'},
    {id:'royal-road', symbols:['IV','V','iii','vi'], name:'Royal Road', mood:'A rising opening settles into two gentle minor chords.', source:'bennett-royal'},
    {id:'andalusian', mode:'minor', symbols:['i','♭VII','♭VI','V'], name:'Andalusian descent', mood:'Descending roots lead to a bright dominant chord.', source:'bennett-andalusian'},
    {id:'harmonic-axis', mode:'minor', symbols:['i','♭VI','♭III','V'], name:'Minor axis', mood:'Minor warmth with a clear pull back to the opening.', source:'bennett-pianote'},
    {id:'major-minor-turn', symbols:['I','III','IV','iv'], name:'Major to minor', mood:'Two changing chord colors, sung with small melodic steps.', source:'bennett-pianote'},
    {id:'harmonic-vamp', mode:'minor', symbols:['i','i','♭VI','V'], name:'Minor pulse', mood:'Stay on the opening chord before a two-chord answer.', source:'bennett-pianote'},
    {id:'dorian-rise', mode:'minor', symbols:['i','♭III','IV','♭VI'], name:'Dorian lift', mood:'A major IV briefly brightens this minor-key phrase.', source:'bennett-pianote'},
    {id:'harmonic-shift', mode:'minor', symbols:['i','iv','♭III','V'], name:'Minor answer', mood:'A soft minor opening builds toward the final major chord.', source:'bennett-pianote'},
    {id:'aeolian-home', mode:'minor', symbols:['i','♭VII','iv','i'], name:'Aeolian return', mood:'Natural-minor colors return gently to the home chord.', source:'bennett-pianote'},
    {id:'minor-drift', mode:'minor', symbols:['i','♭III','v','♭VI'], name:'Minor drift', mood:'A quiet minor dominant keeps the phrase relaxed.', source:'bennett-pianote'},
    {id:'minor-turn', mode:'minor', symbols:['i','♭VII','iv','V'], name:'Minor turnaround', mood:'A descending opening closes with a clear invitation to repeat.', source:'bennett-pianote'}
  ].map(p => {
    const symbols=p.symbols||p.degrees.map(d=>romans[d]);
    return {...p,mode:p.mode||'major',symbols,chords:symbols.map(parseChord),label:symbols.join(' – ')};
  });
  function parseChord(roman) {
    const numeral=roman.replace('♭',''),degree=['I','II','III','IV','V','VI','VII'].indexOf(numeral.toUpperCase());
    return {roman,degree,root:scale[degree]-(roman.startsWith('♭')?1:0),quality:numeral===numeral.toLowerCase()?3:4};
  }
  function barScale(progression,bar) {
    const notes=[...(progression.mode==='minor'?minorScale:scale)],chord=progression.chords[bar];
    [0,chord.quality,7].forEach((interval,i)=>notes[(chord.degree+2*i)%7]=(chord.root+interval)%12);
    return notes;
  }
  function pitchName(pitch,degree,key=0) {
    const letter=spellings[key][degree][0],natural={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[letter];
    let alteration=((pitch-natural)%12+12)%12;if(alteration>6)alteration-=12;
    return letter+(alteration>0?'♯'.repeat(alteration):'♭'.repeat(-alteration));
  }
  function progressionChordName(chord,key=0) {return pitchName((chord.root+key)%12,chord.degree,key)+(chord.quality===3?'m':'');}
  function melodyNoteName(note,key=0) {
    const name=pitchName(note.midi%12,note.degree%7,key);
    const alteration=[...name.slice(1)].reduce((sum,s)=>sum+(s==='♯'?1:-1),0);
    return name+(Math.floor((note.midi-alteration)/12)-1);
  }


  // Each bar contains scale-step offsets and beat lengths. null means a rest.
  // Four individually shaped bars per study keep the phrase conversational.
  const styles = [
    {id:'long-lines', name:'Long lines', feel:'Pop ballad', tempo:76, tip:'Sing on “oo”. Let each long note settle before the small step away.',
      bars:[[[0,2],[1,.5],[0,1],[null,.5]], [[0,1],[1,1],[0,1.5],[null,.5]], [[0,1.5],[-1,.5],[0,1.5],[null,.5]], [[0,3],[null,1]]]},
    {id:'easy-conversation', name:'Easy conversation', feel:'Acoustic pop', tempo:92, tip:'Sing on “da”. Keep the repeated notes light, like a spoken sentence.',
      bars:[[[0,.5],[0,.5],[1,1],[0,1],[null,1]], [[null,.5],[0,1],[1,.5],[0,1],[null,1]], [[0,1],[0,.5],[-1,.5],[0,1],[null,1]], [[1,.5],[0,2.5],[null,1]]]},
    {id:'gentle-offbeats', name:'Gentle offbeats', feel:'Light syncopation', tempo:88, tip:'Sing on “na”. Feel all four beats even when the melody enters between them.',
      bars:[[[null,.5],[0,1],[1,.5],[0,1.5],[null,.5]], [[null,.5],[0,.5],[1,1],[0,1.5],[null,.5]], [[0,1.5],[1,.5],[-1,.5],[0,.5],[null,1]], [[null,.5],[1,.5],[0,2],[null,1]]]},
    {id:'small-arch', name:'Small arch', feel:'Melodic pop', tempo:88, tip:'Sing on “ah”. Shape the rise and fall without making the higher notes louder.',
      bars:[[[0,1],[1,.5],[2,.5],[1,.5],[0,1],[null,.5]], [[0,.5],[1,.5],[2,1],[1,.5],[0,1],[null,.5]], [[0,1],[-1,.5],[-2,.5],[-1,.5],[0,1],[null,.5]], [[1,1],[0,2],[null,1]]]},
    {id:'held-and-moving', name:'Held, then moving', feel:'Soul-pop', tempo:80, tip:'Sing on “noo”. Keep the short notes smooth after each held note.',
      bars:[[[0,2],[1,.5],[-1,.5],[0,.5],[null,.5]], [[0,1.5],[-1,.5],[0,.5],[1,.5],[0,.5],[null,.5]], [[0,2],[-1,.5],[1,.5],[0,.5],[null,.5]], [[0,.5],[1,.5],[0,2],[null,1]]]},
    {id:'little-lift', name:'Little lift', feel:'Bright pop', tempo:100, tip:'Sing on “ya”. Give the short pickup a gentle lift into the longer note.',
      bars:[[[null,1],[0,.5],[1,.5],[0,1.5],[null,.5]], [[null,.5],[-1,.5],[0,2],[null,1]], [[null,1],[0,.5],[1,.5],[2,.5],[1,.5],[0,.5],[null,.5]], [[null,.5],[1,.5],[0,2],[null,1]]]},
    {id:'falling-answer', name:'Falling answer', feel:'Quiet ballad', tempo:78, tip:'Sing on “mm-ah”. Let each descending answer release without losing the pitch.',
      bars:[[[0,1],[-1,.5],[-2,.5],[-1,1],[0,.5],[null,.5]], [[0,1.5],[-1,.5],[0,1],[null,1]], [[0,.5],[-1,.5],[-2,1],[-1,.5],[0,1],[null,.5]], [[0,2.5],[null,1.5]]]},
    {id:'two-note-hook', name:'Two-note hook', feel:'Rhythmic pop', tempo:104, tip:'Sing on “doo”. Keep the pulse steady while the same two notes change rhythm.',
      bars:[[[0,.5],[1,.5],[0,1],[1,.5],[0,1],[null,.5]], [[0,1],[1,.5],[0,.5],[0,1],[null,1]], [[1,.5],[0,1],[1,.5],[0,1.5],[null,.5]], [[1,1],[0,2],[null,1]]]},
    {id:'flowing-eighths', name:'Flowing eighths', feel:'Easy pop run', tempo:84, tip:'Sing on one “oo”. Move through the short scale pattern, then leave space to breathe.',
      bars:[[[0,.5],[1,.5],[2,.5],[1,.5],[0,1],[null,1]], [[0,.5],[-1,.5],[0,.5],[1,.5],[0,1],[null,1]], [[0,.5],[1,.5],[0,.5],[-1,.5],[-2,.5],[-1,.5],[0,.5],[null,.5]], [[1,.5],[-1,.5],[0,2],[null,1]]]},
    {id:'space-and-answer', name:'Space and answer', feel:'Sparse pop', tempo:90, tip:'Sing on “la”. Let the rests be part of the phrase. Enter cleanly after each pause.',
      bars:[[[0,1],[null,.5],[1,.5],[0,1],[null,1]], [[null,1],[0,.5],[-1,.5],[0,1],[null,1]], [[0,.5],[1,.5],[null,1],[0,1],[null,1]], [[null,.5],[1,.5],[0,1.5],[null,1.5]]]}
  ];
  // Preserve half-beat rhythms while giving every bar a full final beat to breathe.
  styles.forEach(style=>style.bars.forEach(bar=>{
    const rest=bar.at(-1);
    if(rest[0]!==null)throw Error('A vocal phrase must end with a rest');
    const extra=Math.max(0,1-rest[1]);
    if(extra){const longest=bar.slice(0,-1).filter(n=>n[0]!==null).sort((a,b)=>b[1]-a[1])[0];longest[1]-=extra;rest[1]+=extra;}
  }));
  function semitone(degree,notes=scale) { return notes[((degree % 7) + 7) % 7] + 12 * Math.floor(degree / 7); }
  function chordDegrees(root) { return [root, (root + 2) % 7, (root + 4) % 7]; }
  function chordName(degree, key=0) { return spellings[key][degree] + ([1,2,5].includes(degree) ? 'm' : ''); }
  function noteName(midi,key) {
    const degree=scale.indexOf(((midi-(key||0))%12+12)%12);
    const name=key!==undefined&&degree>=0?spellings[key][degree]:names[((midi%12)+12)%12];
    return name+(Math.floor(midi/12)-1);
  }
  function compose(progression, style) {
    const pi=progressions.indexOf(progression), si=styles.indexOf(style);
    // Choose whole-bar anchors together so chromatic chord changes stay singable.
    let paths=[{cost:0,last:5,bars:[]}];
    style.bars.forEach((bar,b)=>{
      const notes=barScale(progression,b),tones=chordDegrees(progression.chords[b].degree);
      const offsets=bar.filter(n=>n[0]!==null).map(n=>n[0]);
      const desired=2+((si+pi+[0,1,2,0][b])%4),next=[];
      for(let anchor=0;anchor<=7;anchor++){
        if(!tones.includes(anchor%7)||!offsets.every(o=>anchor+o>=0&&anchor+o<=7))continue;
        const pitches=offsets.map(o=>semitone(anchor+o,notes));
        if(pitches.some((n,i)=>i&&Math.abs(n-pitches[i-1])>5))continue;
        const candidates=paths.filter(path=>!b||Math.abs(pitches[0]-path.last)<=5).map(path=>({
          cost:path.cost+Math.abs(pitches[0]-path.last)*2+Math.abs(anchor-desired),last:pitches.at(-1),bars:[...path.bars,{anchor,notes}]
        }));
        candidates.sort((a,c)=>a.cost-c.cost);if(candidates.length)next.push(candidates[0]);
      }
      paths=next;
    });
    paths.sort((a,b)=>a.cost-b.cost);
    if(!paths.length)throw Error('No singable chord-tone path');
    const melody=[],breaths=[];
    style.bars.forEach((bar,b)=>{
      const {anchor,notes}=paths[0].bars[b];let beat=b*4;
      bar.forEach(([offset,duration],i)=>{
        if(offset!==null){const degree=anchor+offset;melody.push({beat,duration,degree,offset:semitone(degree,notes),bar:b});}
        else if(i===bar.length-1)breaths.push({beat,duration,bar:b});
        beat+=duration;
      });
    });
    return {id:progression.id+'/'+style.id,melody,breaths,beats:16};
  }
  function arrange(progression, style, key=0, octave=3) {
    const root=12*(octave+1)+key, study=compose(progression,style);
    const melody=study.melody.map(n=>({...n,midi:root+n.offset}));
    let last=[48+key,52+key,55+key];
    const chords=progression.chords.map((chord,bar)=>{
      const {degree,quality}=chord,rootPitch=chord.root+key;
      const pcs=[rootPitch,rootPitch+quality,rootPitch+7].map(n=>n%12);
      // Search compact inversions in a fixed accompaniment register.
      const choices=[];
      for(let bottom=45;bottom<=59;bottom++){
        if(!pcs.includes(bottom%12))continue;
        const upper=Array.from({length:12},(_,i)=>bottom+i+1).filter(n=>pcs.includes(n%12));
        const voice=[bottom,...upper.slice(0,2)];
        if(new Set(voice.map(n=>n%12)).size===3)choices.push(voice);
      }
      choices.sort((a,b)=>a.reduce((s,n,i)=>s+Math.abs(n-last[i]),0)-b.reduce((s,n,i)=>s+Math.abs(n-last[i]),0));
      last=choices[0];
      return {beat:bar*4,duration:4,bar,degree,root:chord.root,quality,name:progressionChordName(chord,key),roman:chord.roman,notes:last,bass:36+rootPitch%12};
    });
    return {...study,melody,chords,low:Math.min(...melody.map(n=>n.midi)),high:Math.max(...melody.map(n=>n.midi))};
  }
  // Beat-based events keep melody, harmony and silent echo passes on one clock.
  function timeline(arrangement, mode='together', repeats=2, gap=4) {
    const events=[];
    let cursor=4;
    for(let b=0;b<4;b++)events.push({type:'count',beat:b,number:b+1});
    for(let round=0;round<repeats;round++){
      const passes=mode==='echo'?['listen','sing']:['play'];
      passes.forEach((pass,index)=>{
        const start=cursor;
        events.push({type:'phase',beat:start,pass,round:round+1});
        arrangement.chords.forEach(c=>events.push({...c,type:'chord',beat:start+c.beat}));
        arrangement.melody.forEach(n=>events.push({...n,type:'melody',beat:start+n.beat,audible:mode!=='backing'&&pass!=='sing'}));
        arrangement.breaths.forEach(b=>events.push({...b,type:'breath',beat:start+b.beat}));
        for(let b=0;b<16;b++)events.push({type:'beat',beat:start+b,number:b%4+1});
        cursor+=16;
        if(index<passes.length-1||round<repeats-1){
          events.push({type:'rest',beat:cursor});
          for(let b=0;b<gap;b++)events.push({type:'count',beat:cursor+b,number:b+1});
          cursor+=gap;
        }
      });
    }
    events.push({type:'end',beat:cursor});
    return events.sort((a,b)=>a.beat-b.beat);
  }
  const api={scale,minorScale,names,spellings,romans,progressions,styles,semitone,chordName,progressionChordName,melodyNoteName,barScale,noteName,compose,arrange,timeline};
  globalThis.EtudeMusic=api;
  if(typeof module!=='undefined')module.exports=api;
})();
