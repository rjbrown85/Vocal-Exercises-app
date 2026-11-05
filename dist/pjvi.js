'use strict';
(() => {
  const $=id=>document.getElementById(id),tracks=PJVI_CATALOG;
  let selected=tracks[0],loadGeneration=0;
  function unloadRecording(message='Recording stopped. Use Reload recording to play again.'){
    ++loadGeneration;$('official-player').replaceChildren();$('player-status').textContent=message;
  }
  function stopAll(message){unloadRecording(message);}
  function loadRecording(){
    unloadRecording('Loading the official player…');
    const generation=loadGeneration,frame=document.createElement('iframe');
    frame.title=`${selected.title} · PJVI Vocal Studio · Volume ${selected.volume}`;
    // Use the creator-provided public embed, without artwork so it fits narrow screens.
    frame.src=selected.embedUrl.replace('/artwork=small/','/artwork=none/')+'bgcol=25241f/linkcol=9bded5/transparent=true/';
    frame.allow='autoplay';
    frame.addEventListener('load',()=>{if(generation===loadGeneration)$('player-status').textContent='Press Play in the official player. If it is unavailable, use the source link below.';});
    $('official-player').replaceChildren(frame);
    setTimeout(()=>{if(generation===loadGeneration&&$('player-status').textContent==='Loading the official player…')$('player-status').textContent='Still loading? Open the exercise on PJVI’s Bandcamp using the link below.';},12000);
  }
  function route(){
    const id=location.hash.slice(1);selected=tracks.find(t=>t.id===id)||tracks[0];
    const index=tracks.indexOf(selected);
    $('recording-title').textContent=selected.title;$('recording-volume').textContent=`VOLUME ${selected.volume} · ${selected.duration}`;
    $('recording-count').textContent=`${index+1} / ${tracks.length}`;$('exercise').value=selected.id;
    $('source-link').href=selected.url;
    $('previous').disabled=index===0;$('next').disabled=index===tracks.length-1;
    document.querySelectorAll('[data-track]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.track===selected.id)));
    loadRecording();
  }
  for(const volume of [1,2]){
    const group=document.createElement('optgroup');group.label=`Volume ${volume}`;
    const heading=document.createElement('h2');heading.textContent=`Volume ${volume}`;$('track-list').append(heading);
    for(const track of tracks.filter(t=>t.volume===volume)){
      const option=document.createElement('option');option.value=track.id;option.textContent=`${track.number}. ${volume===1?'Warm up':'Exercise'} · ${track.duration}`;group.append(option);
      const button=document.createElement('button');button.type='button';button.dataset.track=track.id;button.innerHTML=`<span>${track.number}. ${volume===1?'Warm up':'Exercise'}</span><small>${track.duration}</small>`;
      button.setAttribute('aria-label',`${track.title}, Volume ${volume}, ${track.duration}`);
      button.onclick=()=>{location.hash=track.id;};$('track-list').append(button);
    }
    $('exercise').append(group);
  }
  $('exercise').onchange=()=>{location.hash=$('exercise').value;};
  $('previous').onclick=()=>{const index=tracks.indexOf(selected);if(index>0)location.hash=tracks[index-1].id;};
  $('next').onclick=()=>{const index=tracks.indexOf(selected);if(index<tracks.length-1)location.hash=tracks[index+1].id;};
  $('stop-all').onclick=()=>stopAll();$('reload-recording').onclick=loadRecording;
  window.addEventListener('hashchange',route);
  window.addEventListener('pagehide',()=>stopAll());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll('Paused while away. Reload the recording when you return.');});
  route();
})();
