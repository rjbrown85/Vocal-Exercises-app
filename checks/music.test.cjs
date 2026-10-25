const assert=require('node:assert/strict');const M=require('../dist/music.js');
assert.equal(M.exercises.length,155);assert.equal(new Set(M.exercises.map(e=>e.id)).size,155);
for(const [bank,count] of [['fundamentals',8],['intervals',13],['rock',3],['blues',5],['rnb',1],['jazz',10],['pop',2],['agility',10],['pentatonic',39],['major-runs',10],['other-scales',4],...Object.keys(M.trainingBanks).map(bank=>[bank,10])])assert.equal(M.exercises.filter(e=>e.bank===bank).length,count);
let cases=0;
for(const e of M.exercises){if(e.timer)continue;if(e.rhythm){assert.equal(e.rhythm.length,e.degrees.length);assert(e.rhythm.every(v=>v>0))}for(const scale of ['auto','major','minor'])for(let low=36;low<72;low++)for(let high=low+1;high<=84;high++){const b=M.bounds(e,low,high,scale);for(const dir of ['up','down','back']){const route=M.route(b.min,b.max,dir);for(const root of route)for(const offset of M.offsets(e,scale))assert(root+offset>=low&&root+offset<=high,`${e.id} range exceeded`);for(let i=1;i<route.length;i++)assert.equal(Math.abs(route[i]-route[i-1]),1);if(b.min>b.max)assert.equal(route.length,0);cases++}}}
assert.deepEqual(M.route(48,51,'back'),[48,49,50,51,50,49,48]);assert.deepEqual(M.route(48,51,'down'),[51,50,49,48]);assert.equal(M.note(60),'C4');assert.equal(M.note(43),'G2');console.log(`PASS: 155 exercises (149 pitched, 6 timers), unique IDs, rhythms, ${cases} range/direction combinations, chromatic steps and no repeated turnaround.`);

assert.deepEqual(M.offsets(M.exercises.find(e=>e.id==='j8')),[5,3,4,7,4,2,0]);
assert.deepEqual(M.offsets(M.exercises.find(e=>e.id==='j9')),[5,6,7,4,2,0]);

assert.deepEqual(M.offsets(M.exercises.find(e=>e.id==='bl2')),[5,6,7,5,3,0]);
assert.deepEqual(M.offsets(M.exercises.find(e=>e.id==='bl8')),[3,4,7,4,3,0]);
assert(!M.exercises.some(e=>['boyd','cuomo'].includes(e.bank)));

assert(M.exercises.every(e=>e.tempo===120),'Every exercise starts at 120 BPM');

for(const e of M.exercises.filter(e=>M.trainingBanks[e.bank])){assert(e.hint.length>30);assert(M.offsets(e).every(Number.isFinite));}

const ninth=M.exercises.find(e=>e.id==='f7');assert.equal(Math.max(...M.offsets(ninth)),14);assert.equal(Math.max(...M.offsets(ninth,'minor')),14);
for(let semitones=0;semitones<=12;semitones++){const e=M.exercises.find(e=>e.id==='i'+semitones);assert.deepEqual(M.offsets(e),[0,semitones,0,semitones,0]);}
const counting=M.exercises.find(e=>e.id==='f9');assert.deepEqual(counting.groups.slice(0,4),[[1],[1,2,1],[1,2,3,2,1],[1,2,3,4,3,2,1]]);assert.deepEqual(counting.groups.slice(8,11),[[8],[8,7,8],[8,7,6,7,8]]);assert.equal(counting.groups.length,16);assert.equal(counting.degrees.length,128);assert.equal(Object.keys(counting.restAfter).length,15);

assert.deepEqual(M.exercises.filter(e=>e.bank==='fundamentals').map(e=>e.name),['Three-note warm-up','Five-note scale','Three-tone arpeggio','Octave arpeggio','Octave scale','Expanding scale','Octave arpeggio repeat','Nine-tone scale']);
for(const e of M.exercises.filter(e=>e.bank==='agility')){assert(e.degrees.length>=20);assert(e.groups.length===2);assert(Object.keys(e.restAfter).length===1);}
for(const e of M.exercises.filter(e=>e.bank==='pentatonic')){const allowed=e.scale==='minor'?[0,3,5,7,10]:[0,2,4,7,9];assert(M.offsets(e).every(n=>allowed.includes(n%12)),e.id);}
assert.deepEqual(M.offsets(M.exercises.find(e=>e.id==='other2')),[0,2,3,5,7,8,11,12,11,8,7,5,3,2,0]);
assert.deepEqual(M.offsets(M.exercises.find(e=>e.id==='other3')),[0,2,3,5,7,9,11,12,10,8,7,5,3,2,0]);
const chromatic=M.exercises.find(e=>e.id==='other4');assert.deepEqual(chromatic.chord,[0,12]);assert.equal(M.offsets(chromatic).length,25);
assert(M.exercises.every(e=>M.offsets(e).every(Number.isFinite)));
