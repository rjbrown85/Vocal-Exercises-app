(function(root){
const major=[0,2,4,5,7,9,11,12],minor=[0,2,3,5,7,8,10,12];
const make=(id,bank,name,degrees,hint,rhythm=null,scale='major',tempo=80)=>({id,bank,name,degrees,hint,rhythm,scale,tempo});
const exercises=[
make('f1','fundamentals','Three-note warm-up',[1,2,3,2,1],'Small steps. Easy start.'),
make('f2','fundamentals','Five-note scale',[1,2,3,4,5,4,3,2,1],'An even rise and return.'),
make('f3','fundamentals','Triad arpeggio',[1,3,5,3,1],'Find the space between notes.'),
make('f4','fundamentals','Octave arpeggio',[1,3,5,8,5,3,1],'An octave, one note at a time.'),
make('f5','fundamentals','Octave scale',[1,2,3,4,5,6,7,8,7,6,5,4,3,2,1],'A full climb and return.'),
make('f6','fundamentals','Pentatonic run',[1,2,3,5,6,8,6,5,3,2,1],'Five tones. A little more space.'),
make('b1','boyd','Rolling Phrase',[1,2,4,3,2,5,3],'Keep the line connected.',[.5,.5,1,.5,.5,1,2]),
make('b2','boyd','Offbeat Entry',[3,3,5,4,2,1],'Come in after the beat.',[.5,1,.5,.5,.5,2]),
make('b3','boyd','Pentatonic Float',[1,3,2,5,6,5,2,1],'Let the phrase flow.',[1,.5,.5,1,1,.5,.5,2]),
make('b4','boyd','Minor Turn',[5,7,5,4,3,4,1],'A compact, winding descent.',[1,.5,.5,.5,.5,1,2],'minor'),
make('b5','boyd','Leap and Unwind',[2,6,5,3,4,2],'Place the leap. Ease down.',[1,1,.5,.5,1,2]),
make('b6','boyd','Held Note, Quick Tail',[4,5,4,2,3,1],'Hold, then release the run.',[3,.5,.5,.5,.5,2]),
make('b7','boyd','Neighbor Turn',[3,4,3,2,3,5,2],'A small turn inside the phrase.',[1,.5,.5,.5,.5,1,2]),
make('b8','boyd','Rising Waves',[1,3,2,2,4,3,3,5,4,2],'Three small waves upward.',[.5,.5,1,.5,.5,1,.5,.5,1,2]),
make('b9','boyd','Long Arc',[1,2,4,5,8,6,5,3,2],'Shape one long arc.',[1,.5,.5,1,2,.5,.5,1,2],'major',72),
make('b10','boyd','Short / Long',[2,4,3,5,6,5,3,2,1],'A short call. A flowing answer.',[.5,.5,2,.5,.5,.5,.5,1,2]),
make('c1','cuomo','Repeated-Note Hook',[3,3,3,5,2,1],'Steady pitch. Clear rhythm.',[.5,.5,1,1,1,2]),
make('c2','cuomo','Stepwise Answer',[5,4,3,2,3,2,1],'Two phrases, one resolution.',[.5,.5,2,.5,.5,1,2]),
make('c3','cuomo','Thirds and Steps',[1,3,2,4,3,5,2],'Alternate skips and steps.',[1,.5,.5,1,.5,.5,2]),
make('c4','cuomo','Pentatonic Hook',[3,5,6,5,2,3,1],'A compact call and answer.',[.5,.5,1,2,.5,.5,2]),
make('c5','cuomo','Chorus Lift',[1,2,3,6,5,3,2],'A narrow start, a higher answer.',[.5,.5,2,1,.5,.5,2]),
make('c6','cuomo','Upper-Note Anchor',[5,5,6,5,3,3,2],'Return to the upper anchor.',[.5,.5,1,2,.5,.5,2]),
make('c7','cuomo','Leap and Resolve',[3,8,6,5,4,2,1],'Land the leap, resolve the line.',[1,2,.5,.5,1,1,2],'major',72),
make('c8','cuomo','Changed Ending',[1,3,2,1,3,5,2,1],'Same opening. A new ending.',[.5,.5,2,.5,.5,1,1,2]),
make('c9','cuomo','Minor Hook',[1,3,4,3,5,4,2,1],'A darker melodic shape.',[.5,.5,1,2,.5,.5,1,2],'minor'),
make('c10','cuomo','Accent Shift',[3,2,5,3,1,3,2,5,3,1],'Same pitches. Shift the accents.',[1,.5,.5,1,2,.5,1,.5,1,2]),
// Original R&B studies built from common pentatonic and melismatic vocabulary.
make('r1','rnb','Pentatonic Fall',[6,5,3,2,1],'A compact major-pentatonic descent.',[1,.5,.5,1,2],'major',72),
make('r2','rnb','Minor Soul Run',[8,7,5,4,3,1],'Minor-pentatonic descent.',[1,.5,.5,.5,.5,2],'minor',72),
make('r3','rnb','Three-Note Turn',[3,4,3,2,1],'An upper-neighbor turn into the root.',[1,.25,.25,.5,2],'major',68),
make('r4','rnb','Pentatonic Curl',[5,6,5,3,2,3,1],'Reverse direction inside the descent.',[.5,.5,.5,.5,.5,.5,2],'major',72),
make('r5','rnb','Octave Cascade',[8,6,5,3,2,1],'A full-octave pentatonic fall.',[1,.5,.5,.5,.5,2],'major',68),
make('r6','rnb','Rise and Release',[1,2,3,5,6,5,3,2,1],'Climb, linger, and return.',[.5,.5,.5,.5,2,.5,.5,1,2],'major',72),
make('r7','rnb','Held Note, Soul Tail',[5,7,5,4,3,4,3,1],'A long tone opens into a quick minor run.',[2,.25,.25,.5,.25,.25,.5,2],'minor',64),
make('r8','rnb','Triplet Ripple',[6,5,3,5,3,2,3,2,1],'Connected three-note groups.',[1/3,1/3,1/3,1/3,1/3,1/3,1/3,1/3,4/3],'major',64),
make('r9','rnb','Syncopated Answer',[3,5,5,6,5,3,2,1],'A rhythmic opening with a flowing answer.',[.75,.25,1.5,.5,.5,.5,1,2],'major',72),
make('r10','rnb','Minor Waterfall',[8,7,8,7,5,4,5,4,3,1],'Two turns through a descending minor pentatonic line.',[1,.25,.25,.5,.5,.25,.25,.5,.5,2],'minor',64)
,
// Original jazz studies: chord tones, swung eighths, and approach notes.
make('j1','jazz','Swing Steps',[1,2,3,5,4,3,2,1],'Long-short eighth-note pairs.',[2/3,1/3,2/3,1/3,2/3,1/3,1,2],'major',80),
make('j2','jazz','Major Seventh Arc',[1,3,5,7,8,7,5,3],'Outline a major seventh chord.',[2/3,1/3,2/3,1/3,1,2/3,1/3,2],'major',72),
make('j3','jazz','Minor Seventh Answer',[1,3,5,7,5,4,3,1],'A minor seventh arpeggio with a descending answer.',[2/3,1/3,2/3,1/3,1,2/3,1/3,2],'minor',72),
make('j4','jazz','Sixth-Chord Skip',[1,3,5,6,5,3,2,1],'A major-sixth color with a stepwise close.',[2/3,1/3,2/3,1/3,2/3,1/3,1,2],'major',80),
make('j5','jazz','Thirds Sequence',[1,3,2,4,3,5,4,6,5],'Ascending thirds in swing pairs.',[2/3,1/3,2/3,1/3,2/3,1/3,2/3,1/3,2],'major',72),
make('j6','jazz','Triplet Arpeggio',[1,3,5,3,5,7,5,3,1],'Three-note chord-tone groups.',[1/3,1/3,1/3,1/3,1/3,1/3,1/3,1/3,4/3],'major',64),
make('j7','jazz','Swing Turnaround',[3,5,6,5,3,2,3,1],'A short turn with a tonic landing.',[2/3,1/3,1,2/3,1/3,2/3,1/3,2],'major',76),
Object.assign(make('j8','jazz','Third Enclosure',[4,3,3,5,3,2,1],'Approach the major third from above and a semitone below.',[2/3,1/3,1,2/3,1/3,1,2],'major',68),{alterations:{1:-1}}),
Object.assign(make('j9','jazz','Chromatic Fifth Approach',[4,4,5,3,2,1],'Raise the fourth into the fifth.',[2/3,1/3,1,2/3,1/3,2],'major',68),{alterations:{1:1}}),
make('j10','jazz','Descending Jazz Line',[8,7,6,5,4,3,2,3,1],'A swung scale descent with a final turn.',[2/3,1/3,2/3,1/3,2/3,1/3,2/3,1/3,2],'major',76),
// Original pop studies: repeated hooks, pentatonic shapes and chorus lifts.
make('p1','pop','Hook and Answer',[3,3,2,3,5,3,2,1],'',[.5,.5,.5,.5,1,1,1,2]),
make('p2','pop','Chorus Rise',[1,2,3,5,6,5,3],'',[.5,.5,1,.5,.5,2,2]),
make('p3','pop','Pentatonic Bounce',[1,3,3,2,5,5,3,1],'',[.5,.5,1,.5,.5,1,1,2]),
make('p4','pop','Octave Lift',[3,5,8,8,6,5,3,2],'',[1,1,.5,.5,1,.5,.5,2],'major',72),
make('p5','pop','Syncopated Hook',[5,5,3,2,3,5,2,1],'',[.75,.25,1,.5,.5,1,1,2]),
make('p6','pop','Minor Pop Turn',[1,3,5,4,3,2,3,1],'',[1,.5,.5,1,.5,.5,1,2],'minor',76),
make('p7','pop','Held Note Release',[6,5,3,2,3,2,1],'',[2,.5,.5,.5,.5,1,2],'major',72),
make('p8','pop','Rising Sequence',[1,2,3,2,3,4,3,4,5],'',[.5,.5,1,.5,.5,1,.5,.5,2]),
make('p9','pop','Call and Lift',[3,2,1,3,2,5,6,5],'',[.5,.5,2,.5,.5,1,1,2]),
make('p10','pop','Chorus Landing',[8,6,5,5,3,2,1],'',[1,.5,.5,1,.5,.5,2],'major',76)

];
function offsets(e,override='auto'){const scale=override==='auto'?e.scale:override;return e.degrees.map((d,i)=>(scale==='minor'?minor:major)[d-1]+(e.alterations?.[i]||0));}
function bounds(e,low,high,override='auto'){const n=offsets(e,override);return {min:low-Math.min(...n),max:high-Math.max(...n)};}
function route(min,max,direction,start){if(min>max)return [];const s=Math.max(min,Math.min(max,start??(direction==='down'?max:min)));if(direction==='down')return Array.from({length:s-min+1},(_,i)=>s-i);const up=Array.from({length:max-s+1},(_,i)=>s+i);return direction==='back'?[...up,...Array.from({length:max-min},(_,i)=>max-i-1)]:up;}
function note(n){return ['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'][((n%12)+12)%12]+(Math.floor(n/12)-1);}
// Note lengths follow the phrase, without moving its rhythmic onsets.
const connection={p1:.95,p2:1.02,p3:.92,p4:1.01,p5:.94,p6:1.01,p7:1.03,p8:1.01,p9:.98,p10:1.02,j1:.94,j2:.98,j3:.98,j4:.96,j5:.96,j6:.99,j7:.96,j8:1.01,j9:1.01,j10:.98,r1:1.03,r2:1.03,r3:1.02,r4:1.03,r5:1.03,r6:1.03,r7:1.03,r8:1.02,r9:1.01,r10:1.03,f1:1.02,f2:1.02,f3:.98,f4:.98,f5:1.02,f6:1.02,b1:1.03,b2:.9,b3:1.03,b4:1.02,b5:1.02,b6:1.03,b7:1.03,b8:1.02,b9:1.03,b10:1.02,c1:.9,c2:1.01,c3:1.01,c4:.98,c5:1.01,c6:.9,c7:1.02,c8:.96,c9:1,c10:.9};
const phraseEnds={b8:[2,5],b10:[2],c2:[2],c4:[3],c5:[2],c8:[2],c9:[3],c10:[4]};
function articulation(e,i,duration,rhythm='original'){
 const final=i===e.degrees.length-1,repeated=!final&&offsets(e)[i]===offsets(e)[i+1],boundary=rhythm==='original'&&(phraseEnds[e.id]||[]).includes(i);
 let gate=connection[e.id]||.98;
 if(repeated)gate=.82;
 if(boundary)gate=.86;
 if(final)gate=.92;
 return {duration:duration*gate,release:Math.min(.16,duration*(repeated||boundary?.14:.32)),velocity:e.id==='c10'&&i>=5?.65:gate>=.98?.44:.5};
}
const api={exercises,offsets,bounds,route,note,articulation};root.Vocal=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
