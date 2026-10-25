const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),M=require('../dist/music.js');
const src=fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),code=src.slice(src.indexOf('function nextKey('),src.indexOf("$('next-key').onclick"));
function setup(direction,running=false){const route=M.route(48,50,direction),els={};const s={M,isTimed:()=>false,roots:route,pos:0,repeat:2,rootNote:route[0],running,pending:false,holding:true,phraseClock:{},cancels:0,cues:0,cancel(){s.cancels++},keyboard(){},updateKey(){},drawContour(){},resetRoute(){},pause(){s.running=false},runPhrase(cue){assert(cue);s.cues++},$:id=>els[id]??(els[id]={})};vm.createContext(s);vm.runInContext(code,s);return s;}
test('Next Key follows ascending, descending and return routes while holding',()=>{
 for(const direction of ['up','down','back'])for(const running of [false,true]){
  const s=setup(direction,running);for(let i=1;i<s.roots.length;i++){s.nextKey();assert.equal(s.pos,i);assert.equal(s.rootNote,s.roots[i]);assert.equal(s.repeat,0);assert(s.holding);assert.equal(s.cues,running?i:0);}
  const count=s.cancels;s.nextKey();assert.equal(s.cancels,count,'End of route is a no-op');
 }
});
test('timer exercises do not skip keys',()=>{const s=setup('up');s.isTimed=()=>true;s.nextKey();assert.equal(s.pos,0);assert.equal(s.cancels,0);});
