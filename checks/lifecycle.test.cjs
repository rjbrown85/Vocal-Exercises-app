const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const src=fs.readFileSync(require.resolve('../dist/app.js'),'utf8');
const playCode=src.slice(src.indexOf('async function play(){'),src.indexOf('function runPhrase('));
function harness(){
 const els={practice:{hidden:false}},jobs=[];
 const s={starting:false,running:false,roots:[48],token:0,timed:false,Sound:{hold(){},release(){}},isTimed:()=>s.timed,$:id=>els[id]??(els[id]={}),initAudio:()=>new Promise((resolve,reject)=>jobs.push({resolve,reject})),pause(){s.starting=false;s.running=false;s.token++;},cancel(){s.token++;},release(){},wake(){},startBreath(){els.play.textContent='■ STOP'},runPhrase(){s.plays++},plays:0};
 vm.createContext(s);vm.runInContext(playCode,s);return {s,els,jobs};
}
test('late piano load cannot start or overwrite a newer sustain timer',async()=>{
 const {s,els,jobs}=harness();const old=s.play();assert(s.starting);
 s.pause();s.timed=true;const current=s.play();jobs[1].resolve();await current;assert.equal(els.play.textContent,'■ STOP');
 jobs[0].resolve();await old;assert.equal(s.plays,0);assert.equal(els.play.textContent,'■ STOP');assert(s.running);assert(!s.starting);
});
test('stale loading failure cannot stop a newer session',async()=>{
 const {s,els,jobs}=harness();const old=s.play();s.pause();s.timed=true;const current=s.play();jobs[1].resolve();await current;
 jobs[0].reject(Error('network'));await old;assert(s.running);assert.equal(els.play.textContent,'■ STOP');
});
test('loading can be cancelled and a current failure exposes a working retry',async()=>{
 const {s,els,jobs}=harness();const old=s.play();await s.play();assert(!s.starting);jobs[0].resolve();await old;assert(!s.running);
 const next=s.play();jobs[1].reject(Error('network'));await next;assert(!s.starting);assert(!s.running);assert.equal(els.play.textContent,'▶ TRY AGAIN');
 const retry=s.play();jobs[2].resolve();await retry;assert(s.running);assert.equal(s.plays,1);
});
test('audio initialization never changes player controls after navigation',async()=>{
 let resolve;const els={play:{textContent:'■ STOP',disabled:false}},st={ctx:{resume:async()=>{}},piano:{buffers:new Map(),load:()=>new Promise(r=>resolve=r)},refreshMetronome(){},$:id=>els[id]};
 vm.createContext(st);vm.runInContext(src.slice(src.indexOf('async function initAudio('),src.indexOf('function tone(')),st);
 const load=st.initAudio();await new Promise(setImmediate);resolve();await load;assert.equal(els.play.textContent,'■ STOP');assert.equal(els.play.disabled,false);
});

test('cancelling a pending start also releases the loading guard',()=>{
 const st={starting:true,token:0,timers:[],voices:[],clearTimeout(){},highlight(){}};
 vm.createContext(st);vm.runInContext(src.slice(src.indexOf('function cancel(){'),src.indexOf('function highlight(')),st);st.cancel();assert.equal(st.starting,false);assert.equal(st.token,1);
});
