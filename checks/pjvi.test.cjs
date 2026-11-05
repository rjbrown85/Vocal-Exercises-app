const {test}=require('node:test');
const assert=require('node:assert/strict');
const tracks=require('../dist/pjvi-catalog.js');

test('catalog contains twenty distinct official hosted exercises in their two volumes',()=>{
  assert.equal(tracks.length,20);assert.equal(tracks.filter(t=>t.volume===1).length,12);assert.equal(tracks.filter(t=>t.volume===2).length,8);
  for(const key of ['id','url','embedUrl'])assert.equal(new Set(tracks.map(t=>t[key])).size,20);
  for(const t of tracks){assert.match(t.url,/^https:\/\/pjvivocalstudio\.bandcamp\.com\/track\//);assert.match(t.embedUrl,/^https:\/\/bandcamp\.com\/EmbeddedPlayer\/v=2\/track=\d+\//);assert.match(t.duration,/^\d{2}:\d{2}$/);}
  assert.equal(tracks[11].number,12);assert.equal(tracks[12].number,1);assert.equal(tracks[19].number,8);
});
