const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('../dist/etudes-music.js');

test('ten progressions preserve requested chords and offer ten distinct, singable studies each',()=>{
  assert.equal(M.progressions.length,10);assert.equal(M.styles.length,10);
  assert.deepEqual(M.progressions.slice(0,3).map(p=>p.degrees),[[0,4,5,3],[5,3,0,4],[0,5,3,4]]);
  for(const p of M.progressions){
    const melodies=new Set();
    for(const s of M.styles){
      assert.equal(s.bars.length,4);
      for(const bar of s.bars)assert.equal(bar.reduce((sum,n)=>sum+n[1],0),4);
      const a=M.arrange(p,s);
      melodies.add(JSON.stringify(a.melody));
      assert(a.high-a.low<=12,'melody stays within an octave');
      assert.equal(a.beats,16);
      for(let i=0;i<a.melody.length;i++){
        const n=a.melody[i];
        assert(n.beat>=n.bar*4&&n.beat+n.duration<=(n.bar+1)*4);
        assert(M.scale.includes(n.midi%12));
        if(i)assert(Math.abs(n.midi-a.melody[i-1].midi)<=5,'no jump larger than a fourth');
      }
      for(let bar=0;bar<4;bar++){
        const notes=a.melody.filter(n=>n.bar===bar);
        assert(notes.at(-1).beat+notes.at(-1).duration<4*(bar+1),'breathing space in every bar');
        assert(a.chords[bar].notes.some(n=>n%12===notes.at(-1).midi%12),'bar resolves onto a chord tone');
      }
    }
    assert.equal(melodies.size,10,'styles differ in actual notes and rhythm');
  }
});
test('all keys and registers transpose melody and use correctly voiced major/minor chords',()=>{
  for(const p of M.progressions)for(const s of M.styles)for(let key=0;key<12;key++)for(const octave of [2,3,4]){
    const a=M.arrange(p,s,key,octave),c=M.arrange(p,s,0,3);
    assert.deepEqual(a.melody.map(n=>n.midi),c.melody.map(n=>n.midi+key+(octave-3)*12));
    assert(a.low>=36&&a.high<=83);
    for(const chord of a.chords){
      const root=(key+M.scale[chord.degree])%12,third=[1,2,5].includes(chord.degree)?3:4;
      assert.equal(chord.bass%12,root);
      assert.deepEqual(chord.notes.map(n=>n%12).sort((a,b)=>a-b),[root,(root+third)%12,(root+7)%12].sort((a,b)=>a-b));
      assert(chord.notes[2]-chord.notes[0]<12);
    }
  }
  assert.equal(M.noteName(58,6),'A♯3');assert.equal(M.noteName(63,6),'D♯4');
  assert.equal(M.chordName(4,6),'C♯');assert.equal(M.chordName(5,1),'B♭m');
});
test('echo repeats the same harmony, silences the guide on the response, and leaves exact breathing gaps',()=>{
  const a=M.arrange(M.progressions[0],M.styles[0]);
  const t=M.timeline(a,'echo',2,4),phases=t.filter(e=>e.type==='phase');
  assert.deepEqual(phases.map(e=>[e.beat,e.pass,e.round]),[[4,'listen',1],[24,'sing',1],[44,'listen',2],[64,'sing',2]]);
  assert.equal(t.at(-1).beat,80);
  assert.equal(t.filter(e=>e.type==='chord').length,16);
  const first=t.filter(e=>e.type==='melody'&&e.beat<20),response=t.filter(e=>e.type==='melody'&&e.beat>=24&&e.beat<40);
  assert(first.every(e=>e.audible));assert(response.every(e=>!e.audible));
  assert.deepEqual(first.map(e=>e.midi),response.map(e=>e.midi));
  assert(M.timeline(a,'backing',1,0).filter(e=>e.type==='melody').every(e=>!e.audible));
  assert.equal(M.timeline(a,'together',4,0).at(-1).beat,68);
});
