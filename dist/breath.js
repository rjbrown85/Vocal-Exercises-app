/* A clock-based trainer. It never plays or transposes piano notes. */
(function(root){
function frame(protocol,position){
 if(protocol.openEnded)return {done:false,elapsed:position,label:"Sustain comfortably"};
 const length=protocol.phases.reduce((sum,p)=>sum+p.length,0),total=length*protocol.cycles;
 if(position>=total)return {done:true,cycle:protocol.cycles,total};
 const cycle=Math.floor(position/length)+1;let within=position%length;
 for(const phase of protocol.phases){if(within<phase.length)return {done:false,cycle,total,label:phase.label,remaining:phase.length-within,progress:within/phase.length,beat:Math.floor(within)%4+1,bar:Math.floor(within/4)+1,bars:phase.length/4};within-=phase.length;}
}
class Runner{
 constructor(protocol,options){this.protocol=protocol;this.options=options;this.tempo=options.tempo||120;this.offset=0;this.active=false;this.lastClick=-1;}
 rate(){return this.protocol.unit==='beats'?this.tempo/60:1;}
 position(){return this.offset+(this.active?(this.options.now()-this.anchor)*this.rate():0);}
 start(){if(this.active)return;if(frame(this.protocol,this.offset).done){this.offset=0;this.lastClick=-1;}this.anchor=this.options.now();this.active=true;this.tick();if(this.active)this.interval=this.options.every(()=>this.tick(),25);}
 tick(){const position=this.position(),state=frame(this.protocol,position);this.options.update(state);if(state.done){this.pause();this.options.finish();return;}
 const whole=Math.floor(position);if(whole>this.lastClick){this.lastClick=whole;this.options.click();}}
 pause(){if(this.active)this.offset=this.position();this.active=false;if(this.interval!==undefined)this.options.clear(this.interval);this.interval=undefined;}
 setTempo(tempo){const position=this.position();this.offset=position;this.anchor=this.options.now();this.tempo=tempo;}
 reset(){this.pause();this.offset=0;this.lastClick=-1;}
}
const api={Runner,frame};root.BreathClock=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
