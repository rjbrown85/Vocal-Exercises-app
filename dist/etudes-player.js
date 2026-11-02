'use strict';
class EtudePlayer {
  constructor({createAudio,onState=()=>{},onEvent=()=>{},sound={hold(){},release(){}},resumeTimeoutMs=4000}) {
    this.createAudio=createAudio;this.onState=onState;this.onEvent=onEvent;this.sound=sound;
    this.generation=0;this.state='idle';this.voices=new Set();this.timer=null;this.audio=null;
    this.resumeTimeoutMs=resumeTimeoutMs;this.cancelResume=null;this.resetAudio=false;
  }
  prepareAudio() {
    if(this.audio&&(this.resetAudio||this.audio.context.state==='closed')) {
      const old=this.audio;
      this.cachedBuffers=old.piano.buffers;
      old.context.removeEventListener?.('statechange',this.contextListener);
      this.audio=null;
      // A failed or interrupted Safari context is replaced only on the next tap.
      try{Promise.resolve(old.context.close()).catch(()=>{});}catch{}
    }
    if(!this.audio) {
      this.audio=this.createAudio();
      if(this.cachedBuffers?.size===17)this.audio.piano.buffers=this.cachedBuffers;
      const context=this.audio.context;
      this.contextListener=()=>{
        if(this.audio?.context===context&&this.state==='playing'&&context.state!=='running')this.interrupt();
      };
      context.addEventListener?.('statechange',this.contextListener);
    }
    this.resetAudio=false;
  }
  resumeAudio(context) {
    return new Promise((resolve,reject)=>{
      let settled=false;
      const finish=(error,active=true)=>{
        if(settled)return;settled=true;clearTimeout(timer);
        if(this.cancelResume===cancel)this.cancelResume=null;
        if(error)reject(error);else resolve(active);
      };
      const cancel=()=>finish(null,false);
      const timer=setTimeout(()=>finish(Object.assign(Error('Audio did not resume'),{audioInterrupted:true})),this.resumeTimeoutMs);
      this.cancelResume=cancel;
      // This call remains synchronous with the Play tap, before any sample fetch.
      try{Promise.resolve(context.resume()).then(()=>finish(null),error=>finish(Object.assign(error,{audioInterrupted:true})));}
      catch(error){finish(Object.assign(error,{audioInterrupted:true}));}
    });
  }
  interrupt() {
    this.resetAudio=true;this.stop();this.onState('interrupted');
  }
  async start(events,settings) {
    this.stop();
    const generation=++this.generation;
    this.sound.hold();this.state='loading';this.onState('loading');
    try {
      this.prepareAudio();
      const {context,piano}=this.audio;
      if(!await this.resumeAudio(context))return;
      if(generation!==this.generation)return;
      await piano.load();
      if(generation!==this.generation)return;
      if(context.state&&context.state!=='running'){this.interrupt();return;}
      this.settings={...settings};this.setVolume(settings.volume);
      this.events=events;this.audioIndex=0;this.visualIndex=0;
      this.beatSeconds=60/settings.tempo;this.base=context.currentTime+.12;
      this.lastAudioTime=context.currentTime;this.lastClockAdvance=Date.now();
      this.state='playing';this.onState('playing');
      this.tick();if(this.state==='playing')this.timer=setInterval(()=>this.tick(),25);
    } catch(error) {
      if(generation!==this.generation)return;
      if(error.audioInterrupted){this.interrupt();return;}
      this.stop();this.onState('error',error);
    }
  }
  track(source) {
    this.voices.add(source);
    source.addEventListener('ended',()=>this.voices.delete(source),{once:true});
  }
  pianoNote(midi,time,duration,velocity) {
    this.track(this.audio.piano.play(midi,time,Math.max(.04,duration),velocity,.12));
  }
  click(time,accent=false) {
    const {context,master}=this.audio,osc=context.createOscillator(),gain=context.createGain();
    osc.frequency.value=accent?1000:740;
    gain.gain.setValueAtTime(.045,time);gain.gain.exponentialRampToValueAtTime(.0001,time+.045);
    osc.connect(gain);gain.connect(master);osc.start(time);osc.stop(time+.05);
    osc.addEventListener('ended',()=>{osc.disconnect();gain.disconnect()},{once:true});this.track(osc);
  }
  schedule(event,time) {
    const beat=this.beatSeconds;
    if(event.type==='count'||event.type==='beat'&&this.settings.metronome)this.click(time,event.number===1);
    if(event.type==='melody'&&event.audible)this.pianoNote(event.midi,time,event.duration*beat*.93,.68);
    if(event.type==='chord') {
      this.pianoNote(event.bass,time,beat*3.7,.28);
      const pattern=this.settings.accompaniment;
      if(pattern==='broken') {
        [0,1,2,1,0,1,2,1].forEach((i,n)=>this.pianoNote(event.notes[i],time+n*.5*beat,beat*.65,.25));
      } else if(pattern==='pulse') {
        [0,1.5,2.5].forEach(at=>event.notes.forEach(n=>this.pianoNote(n,time+at*beat,beat*.75,.21)));
      } else event.notes.forEach(n=>this.pianoNote(n,time,beat*3.8,.24));
    }
  }
  tick() {
    if(this.state!=='playing')return;
    const now=this.audio.context.currentTime;
    if(this.audio.context.state&&this.audio.context.state!=='running'){this.interrupt();return;}
    if(now!==this.lastAudioTime){this.lastAudioTime=now;this.lastClockAdvance=Date.now();}
    else if(Date.now()-this.lastClockAdvance>2000){this.interrupt();return;}
    try {
      while(this.audioIndex<this.events.length&&this.base+this.events[this.audioIndex].beat*this.beatSeconds<now+.4) {
        const event=this.events[this.audioIndex++],time=this.base+event.beat*this.beatSeconds;
        // Never play a backlog after a suspended tab or delayed scheduler.
        if(time>=now-.04)this.schedule(event,Math.max(time,now));
      }
      while(this.visualIndex<this.events.length&&this.base+this.events[this.visualIndex].beat*this.beatSeconds<=now) {
        const event=this.events[this.visualIndex++];
        if(event.type==='end'){this.stop();this.onState('complete');return;}
        this.onEvent(event);
      }
      this.onEvent({type:'clock',beat:Math.max(0,(now-this.base)/this.beatSeconds)});
    } catch(error) {this.stop();this.onState('error',error);}
  }
  setVolume(value) {if(this.audio)this.audio.master.gain.setTargetAtTime(value/100,this.audio.context.currentTime,.02);}
  stop() {
    ++this.generation;clearInterval(this.timer);this.timer=null;this.cancelResume?.();
    this.voices.forEach(source=>{try{if(source.fadeOut)source.fadeOut();else source.stop();}catch{}});
    this.voices.clear();this.state='idle';this.sound.release(80);this.onState('idle');
  }
}
globalThis.EtudePlayer=EtudePlayer;
if(typeof module!=='undefined')module.exports=EtudePlayer;
