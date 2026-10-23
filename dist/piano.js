/* Salamander Grand Piano samples: Alexander Holm, CC BY 3.0.
   https://github.com/Tonejs/audio/tree/efd8296360f9526e379bfbe5c1698ff54d6a1d34/salamander
   Samples unchanged. Nearest-sample pitch shifting and release envelope at playback. */
class SamplePiano {
  constructor(context,output){this.context=context;this.output=output;this.buffers=new Map();this.loading=null;}
  async load(){
    if(this.buffers.size===17)return;
    if(this.loading)return this.loading;
    this.loading=(async()=>{
      const entries=await Promise.all(Array.from({length:17},async(_,i)=>{
        const midi=36+i*3,name=['C','Ds','Fs','A'][i%4]+(Math.floor(midi/12)-1);
        const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
        try{
          const response=await fetch(`audio/piano/${name}.mp3`,{signal:controller.signal});
          if(!response.ok)throw Error('Piano sample unavailable');
          const buffer=await this.context.decodeAudioData(await response.arrayBuffer());
          return [midi,buffer];
        }finally{clearTimeout(timeout)}
      }));
      this.buffers=new Map(entries);
    })();
    try{await this.loading}finally{this.loading=null}
  }
  play(note,time,duration,velocity=.55,release=.28,offset=0){
    const midi=Math.min(84,Math.max(36,36+Math.round((note-36)/3)*3));
    const buffer=this.buffers.get(midi);if(!buffer)throw Error('Piano not loaded');
    const source=this.context.createBufferSource(),gain=this.context.createGain();
    source.buffer=buffer;source.playbackRate.value=2**((note-midi)/12);
    source.connect(gain);gain.connect(this.output);
    const level=Math.max(.001,Math.min(1,velocity))*.85;
    gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(level,time+.004);
    gain.gain.setValueAtTime(level,time+Math.max(.02,duration));
    gain.gain.exponentialRampToValueAtTime(.0001,time+Math.max(.02,duration)+release);
    source.start(time,Math.min(Math.max(0,offset)*source.playbackRate.value,Math.max(0,buffer.duration-.01)));source.stop(time+Math.max(.02,duration)+release+.02);
    source.addEventListener('ended',()=>{source.disconnect();gain.disconnect()},{once:true});
    return source;
  }
}
globalThis.SamplePiano=SamplePiano;
