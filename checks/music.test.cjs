const assert=require('node:assert/strict');const M=require('../dist/music.js');
assert.equal(M.exercises.length,106);assert.equal(new Set(M.exercises.map(e=>e.id)).size,106);
for(const [bank,count] of [['fundamentals',6],['blues',10],['rnb',10],['jazz',10],['pop',10],['agility',10],...Object.keys(M.trainingBanks).map(bank=>[bank,10])])assert.equal(M.exercises.filter(e=>e.bank===bank).length,count);
let cases=0;
for(const e of M.exercises){if(e.timer)continue;if(e.rhythm){assert.equal(e.rhythm.length,e.degrees.length);assert(e.rhythm.every(v=>v>0))}for(const scale of ['auto','major','minor'])for(let low=36;low<72;low++)for(let high=low+1;high<=84;high++){const b=M.bounds(e,low,high,scale);for(const dir of ['up','down','back']){const route=M.route(b.min,b.max,dir);for(const root of route)for(const offset of M.offsets(e,scale))assert(root+offset>=low&&root+offset<=high,`${e.id} range exceeded`);for(let i=1;i<route.length;i++)assert.equal(Math.abs(route[i]-route[i-1]),1);if(b.min>b.max)assert.equal(route.length,0);cases++}}}
assert.deepEqual(M.route(48,51,'back'),[48,49,50,51,50,49,48]);assert.deepEqual(M.route(48,51,'down'),[51,50,49,48]);assert.equal(M.note(60),'C4');assert.equal(M.note(43),'G2');console.log(`PASS: 106 exercises (100 pitched, 6 timers), unique IDs, rhythms, ${cases} range/direction combinations, chromatic steps and no repeated turnaround.`);

assert.deepEqual(M.offsets(M.exercises.find(e=>e.id==='j8')),[5,3,4,7,4,2,0]);
assert.deepEqual(M.offsets(M.exercises.find(e=>e.id==='j9')),[5,6,7,4,2,0]);

assert.deepEqual(M.offsets(M.exercises.find(e=>e.id==='bl2')),[5,6,7,5,3,0]);
assert.deepEqual(M.offsets(M.exercises.find(e=>e.id==='bl8')),[3,4,7,4,3,0]);
assert(!M.exercises.some(e=>['boyd','cuomo'].includes(e.bank)));

assert(M.exercises.every(e=>e.tempo===120),'Every exercise starts at 120 BPM');

for(const e of M.exercises.filter(e=>M.trainingBanks[e.bank])){assert(e.hint.length>30);assert(M.offsets(e).every(Number.isFinite));}
