(function(root){
const major=[0,2,4,5,7,9,11,12],minor=[0,2,3,5,7,8,10,12];
const make=(id,bank,name,degrees,hint,rhythm=null,scale='major',tempo=120)=>({id,bank,name,degrees,hint,rhythm,scale,tempo});
const exercises=[
make('f1','fundamentals','Three-note warm-up',[1,2,3,2,1],'Small steps. Easy start.'),
make('f2','fundamentals','Five-note scale',[1,2,3,4,5,4,3,2,1],'An even rise and return.'),
make('f3','fundamentals','Triad arpeggio',[1,3,5,3,1],'Find the space between notes.'),
make('f4','fundamentals','Octave arpeggio',[1,3,5,8,5,3,1],'An octave, one note at a time.'),
make('f5','fundamentals','Octave scale',[1,2,3,4,5,6,7,8,7,6,5,4,3,2,1],'A full climb and return.'),
make('f6','fundamentals','Pentatonic run',[1,2,3,5,6,8,6,5,3,2,1],'Five tones. A little more space.'),
// Original blues studies using minor pentatonic shapes, blue notes and swing.
make('bl1','blues','Minor Pentatonic Call',[1,3,4,5,4,3,1],'',[1,2/3,1/3,1,2/3,1/3,2],'minor',120),
Object.assign(make('bl2','blues','Blue-Note Turn',[4,4,5,4,3,1],'',[2/3,1/3,1,2/3,1/3,2],'minor',120),{alterations:{1:1}}),
make('bl3','blues','Seventh Descent',[8,7,5,4,3,1],'',[1,2/3,1/3,2/3,1/3,2],'minor',120),
make('bl4','blues','Repeated Blues Call',[5,5,7,5,4,3,1],'',[.5,.5,1,1,2/3,1/3,2],'minor',120),
Object.assign(make('bl5','blues','Blue-Note Fall',[5,4,4,3,1],'',[1,2/3,1/3,1,2],'minor',120),{alterations:{1:1}}),
make('bl6','blues','Triplet Blues Turn',[5,4,3,4,3,1,3,1],'',[1/3,1/3,1/3,1/3,1/3,1/3,1,2],'minor',120),
make('bl7','blues','Call and Low Answer',[1,3,5,7,5,3,4,3,1],'',[2/3,1/3,1,1,1,2/3,1/3,1,2],'minor',120),
Object.assign(make('bl8','blues','Third Color Turn',[3,3,5,3,3,1],'',[2/3,1/3,1,2/3,1/3,2],'major',120),{alterations:{0:-1,4:-1}}),
Object.assign(make('bl9','blues','Sixth and Flat Seventh',[1,3,5,6,7,6,5,3,1],'',[2/3,1/3,2/3,1/3,1,2/3,1/3,1,2],'major',120),{alterations:{4:-1}}),
Object.assign(make('bl10','blues','Held Note Blues Tail',[5,7,5,4,4,3,1],'',[2,.5,.5,.5,.5,1,2],'minor',120),{alterations:{3:1}}),
// Original R&B studies built from common pentatonic and melismatic vocabulary.
make('r1','rnb','Pentatonic Fall',[6,5,3,2,1],'A compact major-pentatonic descent.',[1,.5,.5,1,2],'major',120),
make('r2','rnb','Minor Soul Run',[8,7,5,4,3,1],'Minor-pentatonic descent.',[1,.5,.5,.5,.5,2],'minor',120),
make('r3','rnb','Three-Note Turn',[3,4,3,2,1],'An upper-neighbor turn into the root.',[1,.25,.25,.5,2],'major',120),
make('r4','rnb','Pentatonic Curl',[5,6,5,3,2,3,1],'Reverse direction inside the descent.',[.5,.5,.5,.5,.5,.5,2],'major',120),
make('r5','rnb','Octave Cascade',[8,6,5,3,2,1],'A full-octave pentatonic fall.',[1,.5,.5,.5,.5,2],'major',120),
make('r6','rnb','Rise and Release',[1,2,3,5,6,5,3,2,1],'Climb, linger, and return.',[.5,.5,.5,.5,2,.5,.5,1,2],'major',120),
make('r7','rnb','Held Note, Soul Tail',[5,7,5,4,3,4,3,1],'A long tone opens into a quick minor run.',[2,.25,.25,.5,.25,.25,.5,2],'minor',120),
make('r8','rnb','Triplet Ripple',[6,5,3,5,3,2,3,2,1],'Connected three-note groups.',[1/3,1/3,1/3,1/3,1/3,1/3,1/3,1/3,4/3],'major',120),
make('r9','rnb','Syncopated Answer',[3,5,5,6,5,3,2,1],'A rhythmic opening with a flowing answer.',[.75,.25,1.5,.5,.5,.5,1,2],'major',120),
make('r10','rnb','Minor Waterfall',[8,7,8,7,5,4,5,4,3,1],'Two turns through a descending minor pentatonic line.',[1,.25,.25,.5,.5,.25,.25,.5,.5,2],'minor',120)
,
// Original jazz studies: chord tones, swung eighths, and approach notes.
make('j1','jazz','Swing Steps',[1,2,3,5,4,3,2,1],'Long-short eighth-note pairs.',[2/3,1/3,2/3,1/3,2/3,1/3,1,2],'major',120),
make('j2','jazz','Major Seventh Arc',[1,3,5,7,8,7,5,3],'Outline a major seventh chord.',[2/3,1/3,2/3,1/3,1,2/3,1/3,2],'major',120),
make('j3','jazz','Minor Seventh Answer',[1,3,5,7,5,4,3,1],'A minor seventh arpeggio with a descending answer.',[2/3,1/3,2/3,1/3,1,2/3,1/3,2],'minor',120),
make('j4','jazz','Sixth-Chord Skip',[1,3,5,6,5,3,2,1],'A major-sixth color with a stepwise close.',[2/3,1/3,2/3,1/3,2/3,1/3,1,2],'major',120),
make('j5','jazz','Thirds Sequence',[1,3,2,4,3,5,4,6,5],'Ascending thirds in swing pairs.',[2/3,1/3,2/3,1/3,2/3,1/3,2/3,1/3,2],'major',120),
make('j6','jazz','Triplet Arpeggio',[1,3,5,3,5,7,5,3,1],'Three-note chord-tone groups.',[1/3,1/3,1/3,1/3,1/3,1/3,1/3,1/3,4/3],'major',120),
make('j7','jazz','Swing Turnaround',[3,5,6,5,3,2,3,1],'A short turn with a tonic landing.',[2/3,1/3,1,2/3,1/3,2/3,1/3,2],'major',120),
Object.assign(make('j8','jazz','Third Enclosure',[4,3,3,5,3,2,1],'Approach the major third from above and a semitone below.',[2/3,1/3,1,2/3,1/3,1,2],'major',120),{alterations:{1:-1}}),
Object.assign(make('j9','jazz','Chromatic Fifth Approach',[4,4,5,3,2,1],'Raise the fourth into the fifth.',[2/3,1/3,1,2/3,1/3,2],'major',120),{alterations:{1:1}}),
make('j10','jazz','Descending Jazz Line',[8,7,6,5,4,3,2,3,1],'A swung scale descent with a final turn.',[2/3,1/3,2/3,1/3,2/3,1/3,2/3,1/3,2],'major',120),
// Original pop studies: repeated hooks, pentatonic shapes and chorus lifts.
make('p1','pop','Hook and Answer',[3,3,2,3,5,3,2,1],'',[.5,.5,.5,.5,1,1,1,2]),
make('p2','pop','Chorus Rise',[1,2,3,5,6,5,3],'',[.5,.5,1,.5,.5,2,2]),
make('p3','pop','Pentatonic Bounce',[1,3,3,2,5,5,3,1],'',[.5,.5,1,.5,.5,1,1,2]),
make('p4','pop','Octave Lift',[3,5,8,8,6,5,3,2],'',[1,1,.5,.5,1,.5,.5,2],'major',120),
make('p5','pop','Syncopated Hook',[5,5,3,2,3,5,2,1],'',[.75,.25,1,.5,.5,1,1,2]),
make('p6','pop','Minor Pop Turn',[1,3,5,4,3,2,3,1],'',[1,.5,.5,1,.5,.5,1,2],'minor',120),
make('p7','pop','Held Note Release',[6,5,3,2,3,2,1],'',[2,.5,.5,.5,.5,1,2],'major',120),
make('p8','pop','Rising Sequence',[1,2,3,2,3,4,3,4,5],'',[.5,.5,1,.5,.5,1,.5,.5,2]),
make('p9','pop','Call and Lift',[3,2,1,3,2,5,6,5],'',[.5,.5,2,.5,.5,1,1,2]),
make('p10','pop','Chorus Landing',[8,6,5,5,3,2,1],'',[1,.5,.5,1,.5,.5,2],'major',120) ,
// Original agility studies with connected turns and deliberate interval changes.
make('a1','agility','Neighbor Loops',[2,3,2,1,2,3,2,1],'',[.5,.5,.5,.5,.5,.5,1,2],'major',120),
make('a2','agility','Three-Note Cells',[1,2,3,2,3,4,3,4,5,3,1],'',[.5,.5,.5,.5,.5,.5,.5,.5,1,1,2],'major',120),
make('a3','agility','Thirds Ladder',[1,3,2,4,3,5,4,6,5,3,1],'',[.5,.5,.5,.5,.5,.5,.5,.5,1,1,2],'major',120),
make('a4','agility','Pentatonic Zigzag',[1,3,2,5,3,6,5,8,6,5,3,1],'',[.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,1,2],'major',120),
make('a5','agility','Triplet Climb',[1,2,3,2,3,4,3,4,5,4,3,1],'',[1/3,1/3,1/3,1/3,1/3,1/3,1/3,1/3,1/3,1/3,2/3,2],'major',120),
make('a6','agility','Descending Cells',[8,7,6,7,6,5,6,5,4,5,3,1],'',[.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,1,2],'major',120),
make('a7','agility','Minor Weave',[1,2,3,5,4,3,4,2,3,1],'',[.5,.5,.5,.5,.5,.5,.5,.5,1,2],'minor',120),
make('a8','agility','Arpeggio Turns',[1,3,5,3,2,3,5,8,5,3,2,1],'',[.5,.5,.5,.5,.5,.5,1,1,.5,.5,1,2],'major',120),
make('a9','agility','Five-Note Ripple',[1,2,3,4,5,4,3,2,3,4,5,3,1],'',[.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,1,1,2],'major',120),
make('a10','agility','Leap and Settle',[1,5,4,3,2,6,5,4,3,2,1],'',[1,.5,.5,.5,1,.5,.5,.5,.5,1,2],'major',120),
// Original general voice-training studies. Guidance is not a register assessment.
make("chest1","chest","Speaking hum",[1, 1],"Start with a relaxed “mm” near your speaking pitch. Release, then repeat without pressing your lips.",[3, 3]),
make("chest2","chest","Hum to mah",[1, 2, 1],"Hum the first note, then open to “mah” for the next two. Keep the same easy volume.",[2, 2, 3]),
make("chest3","chest","Mum steps",[1, 2, 3, 2, 1],"Sing “mum” on each note with a relaxed jaw. Let the consonant be brief.",[1, 1, 2, 1, 2]),
make("chest4","chest","Low noo descent",[5, 4, 3, 2, 1],"Sing a rounded “noo” downward. Keep the bottom notes clear without pushing them lower.",[1, 1, 1, 1, 3]),
make("chest5","chest","Vee to vowel",[1, 3, 2, 1],"Start each note with a gentle “v,” then sustain “ee.” Avoid biting your lower lip.",[2, 2, 1, 3]),
make("chest6","chest","Conversational yah",[1, 2, 1, 3, 1],"Sing “yah” as easily as you would speak it. Keep the tongue and jaw free.",[1, 1, 2, 1, 3]),
make("chest7","chest","Warm thirds",[1, 3, 1, 3, 2, 1],"Use “moh” on each note. Carry the same comfortable tone through the small jumps.",[1, 1, 1, 2, 1, 2]),
make("chest8","chest","Five-note mah",[1, 2, 3, 4, 5, 3, 1],"Sing a connected “mah.” Keep the top as easy as the starting note.",[1, 1, 1, 1, 2, 1, 3]),
make("chest9","chest","Steady oh",[1],"Begin “oh” gently and hold it evenly. Release before the tone starts to squeeze.",[6]),
make("chest10","chest","Soft descending hum",[3, 2, 1],"Hum softly down the notes. Finish with an easy release rather than vocal fry.",[2, 2, 4]),
make("mix1","mix","Lip-trill bridge",[1, 3, 5, 3, 1],"Follow the notes with a loose lip trill. Use “vv” instead if your lips will not trill.",[1, 1, 2, 1, 2]),
make("mix2","mix","Ng to oo",[1, 3, 5, 3, 1],"Use “ng” as in “sing” on the first two notes. Open gently to “oo” for the rest.",[2, 2, 2, 1, 3]),
make("mix3","mix","Light noo climb",[1, 2, 3, 4, 5, 4, 3, 2, 1],"Sing “noo” with a small, rounded vowel. Allow the upper notes to feel lighter.",null),
make("mix4","mix","Woo fifth glide",[1, 5, 1],"Slide gently on “woo” between the piano targets. Keep the slide quiet and unforced.",[2, 2, 3]),
make("mix5","mix","Gentle mum arc",[1, 3, 4, 5, 4, 3, 1],"Use a light “mum” on each note. Reduce weight rather than adding volume at the peak.",[1, 1, 1, 2, 1, 1, 3]),
make("mix6","mix","Vowel bridge",[1, 3, 5, 3, 1],"Sing “mee, mee, moo, moo, moo.” Change the vowel without tightening your jaw.",[2, 1, 2, 1, 3]),
make("mix7","mix","Descending lightness",[5, 4, 3, 2, 1],"Start with an easy “oo” and descend. Keep that light feeling as the notes get lower.",[2, 1, 1, 1, 3]),
make("mix8","mix","Connected thirds",[1, 3, 2, 4, 3, 5, 3, 1],"Sing “yu” gently on each note. Keep the small jumps connected.",[1, 1, 1, 1, 1, 2, 1, 3]),
make("mix9","mix","Bridge arpeggio",[1, 3, 4, 5, 4, 3, 1],"Use a lip trill or “oo.” Let the sound adjust through the bridge instead of forcing the same weight.",[1, 1, 1, 2, 1, 1, 3]),
make("mix10","mix","Bridge and settle",[1, 2, 3, 5, 3, 2, 1],"Sing a light “noo,” then settle gently onto the last note. Avoid getting louder on the way up.",[1, 1, 1, 2, 1, 1, 4]),
make("head1","head","Quiet woo hold",[1],"Sing a light “woo” at a comfortable upper pitch. Use only as much air as the tone needs.",[5]),
make("head2","head","Oo descent",[5, 4, 3, 2, 1],"Sing softly on “oo.” Keep the downward line connected without making it heavy.",[1, 1, 1, 1, 3]),
make("head3","head","Ng upper arc",[1, 3, 5, 3, 1],"Hum on “ng” as in “sing.” Let the tongue rest rather than pressing it back.",[1, 1, 2, 1, 3]),
make("head4","head","Owl call",[1, 5, 3, 1],"Use a gentle “hoo” for each pitch. Keep it playful and small rather than breathy and loud.",[2, 2, 2, 3]),
make("head5","head","Head-voice steps",[1, 2, 3, 4, 5, 4, 3, 2, 1],"Sing a clear, light “oo” through the steps. Choose a range where it stays easy.",null),
make("head6","head","Falsetto float",[1, 3, 5, 3, 1],"Try a soft falsetto “oo.” A little airiness is fine, but do not force extra air through.",[2, 2, 2, 2, 3]),
make("head7","head","Soft ee line",[3, 4, 5, 4, 3, 2, 1],"Sing a gentle “ee.” Keep the mouth relaxed instead of stretching into a wide smile.",[1, 1, 2, 1, 1, 1, 3]),
make("head8","head","Light octave glide",[1, 8, 5, 1],"Slide on “woo” between the piano targets. Reduce the range if the octave feels effortful.",[2, 3, 2, 3]),
make("head9","head","Oo to oh",[1, 3, 5, 3, 1],"Begin on “oo,” then open slightly toward “oh” on the way down. Keep the same light volume.",[2, 1, 2, 1, 3]),
make("head10","head","Floating finish",[5, 3, 2, 1],"Sing “hoo” downward and let the last note fade gently. Do not squeeze to keep it going.",[2, 2, 2, 4]),
make("belt1","belt","Easy spoken hey",[1, 1],"Say “hey” comfortably, then sing it on the piano pitch. Use conversational energy, not a shout.",[2, 3]),
make("belt2","belt","Bright three-note eh",[1, 2, 3, 2, 1],"Sing “eh” with a clear, moderately bright sound. Keep your neck and jaw comfortable.",[1, 1, 2, 1, 2]),
make("belt3","belt","Neh steps",[1, 2, 1, 3, 2, 1],"Use a light “neh” on each note. Brightness should come without extra pressure.",[1, 1, 1, 2, 1, 3]),
make("belt4","belt","Yah thirds",[1, 3, 2, 1],"Sing “yah” with a speech-like start. Keep the higher note at the same moderate volume.",[2, 2, 1, 3]),
make("belt5","belt","Meh descent",[5, 4, 3, 2, 1],"Sing “meh” downward in a comfortable middle range. Avoid holding the throat rigid.",[1, 1, 1, 1, 3]),
make("belt6","belt","Hey and hold",[1, 3, 3, 1],"Use one gentle “hey” per note. Hold the longer note with steady ease, not added force.",[1, 1, 3, 2]),
make("belt7","belt","Clear vowel turn",[1, 2, 3, 2, 1],"Sing “yeah” lightly across the line. Keep the vowel comfortable instead of spreading it wider.",[1, 1, 2, 1, 3]),
make("belt8","belt","Moderate call",[1, 3, 5, 3, 1],"Sing a friendly “hey” as if addressing someone nearby. Stop the climb before you need to shout.",[1, 1, 2, 1, 3]),
make("belt9","belt","Small dynamic arc",[1],"Hold “eh” at an easy pitch. Grow slightly from soft to moderate, then return to soft.",[6]),
make("belt10","belt","Release to hum",[3, 2, 1],"Sing “meh, meh, mm.” Finish with a quiet hum and let your speaking voice feel easy again.",[2, 2, 4]),
{"id": "breath1", "bank": "breath", "name": "Easy breath cycle", "degrees": [], "hint": "Breathe in gently for 3 seconds, out for 5, then breathe normally for 4. Do not fill to maximum. Pause if you feel lightheaded.", "rhythm": null, "scale": "major", "tempo": 120, "timer": {"unit": "seconds", "cycles": 3, "phases": [{"label": "Breathe in", "length": 3}, {"label": "Breathe out", "length": 5}, {"label": "Breathe normally", "length": 4}]}},
{"id": "breath2", "bank": "breath", "name": "Steady hiss", "degrees": [], "hint": "Inhale comfortably for 3 seconds. Hiss softly for 6, then take 4 seconds of normal breathing. Stop the hiss early if needed. Pause if you feel lightheaded.", "rhythm": null, "scale": "major", "tempo": 120, "timer": {"unit": "seconds", "cycles": 3, "phases": [{"label": "Breathe in", "length": 3}, {"label": "Hiss gently", "length": 6}, {"label": "Breathe normally", "length": 4}]}},
{"id": "breath3", "bank": "breath", "name": "One-bar exhale", "degrees": [], "hint": "Inhale for one bar, exhale gently for one bar, then breathe normally for one bar. Each bar has four clicks. Pause if you feel lightheaded.", "rhythm": null, "scale": "major", "tempo": 120, "timer": {"unit": "beats", "cycles": 3, "phases": [{"label": "Breathe in", "length": 4}, {"label": "Breathe out", "length": 4}, {"label": "Breathe normally", "length": 4}]}},
{"id": "breath4", "bank": "breath", "name": "Two-bar hiss", "degrees": [], "hint": "Take one bar to inhale, hiss steadily for two bars, then breathe normally for two bars. Keep the air easy. Pause if you feel lightheaded.", "rhythm": null, "scale": "major", "tempo": 120, "timer": {"unit": "beats", "cycles": 3, "phases": [{"label": "Breathe in", "length": 4}, {"label": "Hiss gently", "length": 8}, {"label": "Breathe normally", "length": 8}]}},
{"id": "breath5", "bank": "breath", "name": "Gentle s pulses", "degrees": [], "hint": "Inhale for one bar. Make one light “s” on each of the next four clicks, then breathe normally for two bars. Avoid forceful abdominal pumping. Pause if you feel lightheaded.", "rhythm": null, "scale": "major", "tempo": 120, "timer": {"unit": "beats", "cycles": 3, "phases": [{"label": "Breathe in", "length": 4}, {"label": "Pulse s", "length": 4}, {"label": "Breathe normally", "length": 8}]}},
{"id": "breath6", "bank": "breath", "name": "Timed lip trill", "degrees": [], "hint": "Inhale gently for 3 seconds. Trill at any comfortable pitch for 5 seconds, then breathe normally for 4. Use “vv” if preferred. Pause if you feel lightheaded.", "rhythm": null, "scale": "major", "tempo": 120, "timer": {"unit": "seconds", "cycles": 3, "phases": [{"label": "Breathe in", "length": 3}, {"label": "Trill gently", "length": 5}, {"label": "Breathe normally", "length": 4}]}},
make("breath7","breath","Long-tone balance",[1],"Hold “oh” gently and evenly. At slower tempos, release early rather than running out of breath.",[8]),
make("breath8","breath","Gentle swell",[1],"Sustain “oo,” growing slightly louder and then softer. Keep the pitch steady throughout.",[8]),
make("breath9","breath","Sustained descent",[5, 3, 2, 1],"Sing “voo” with connected notes. Let the phrase end naturally before your breath feels depleted.",[2, 2, 2, 4]),
make("breath10","breath","Even phrase",[1, 2, 3, 5, 3, 2, 1],"Use a smooth “oo” across the phrase. Take a quiet breath before the next chord, or pause when needed.",[1, 1, 1, 2, 1, 1, 3])
];
const trainingBanks={"chest": {"name": "Chest Voice", "color": "#92cefb", "icon": "blues", "tip": "Stay near an easy speaking range. Keep the sound clear, not loud."}, "mix": {"name": "Mix", "color": "#c8b1ed", "icon": "jazz", "tip": "Let the sound lighten as pitch rises. Do not force one register upward."}, "head": {"name": "Head Voice & Falsetto", "color": "#f2a5ce", "icon": "pop", "tip": "Use a light, easy upper register. Head voice and falsetto may feel different."}, "belt": {"name": "Belting", "color": "#f5bc96", "icon": "fundamentals", "tip": "Warm up first. These are moderate-volume belt foundations, not maximum-power drills."}, "breath": {"name": "Breath & Sustain", "color": "#a9dfb5", "icon": "agility", "tip": "Take an easy breath. Finish before you run out of air and breathe whenever needed."}};

// Practice presets, not measurements of a singer's register. MIDI 60 is C4.
const rangePresets={
 general:{baritone:[43,72],tenor:[48,76]},
 chest:{baritone:[43,58],tenor:[48,60]},
 mix:{baritone:[57,65],tenor:[60,69]},
 head:{baritone:[64,77],tenor:[65,79]},
 belt:{baritone:[48,64],tenor:[50,67]},
 breath:{baritone:[48,60],tenor:[50,62]}
};
const rangeGroup=bank=>rangePresets[bank]?bank:'general';
const rangeLimit=bank=>bank==='belt'?72:84;
function presetRange(bank,voice='baritone'){
 const type=voice==='tenor'?'tenor':'baritone', [low,high]=rangePresets[rangeGroup(bank)][type];
 return {low,high,preset:type};
}
function storedRange(bank,voice,saved){
 const low=Number(saved?.low),high=Number(saved?.high);
 if(!Number.isInteger(low)||!Number.isInteger(high)||low<36||high>rangeLimit(bank)||low>=high||!['baritone','tenor','custom'].includes(saved?.preset))return presetRange(bank,voice);
 return {low,high,preset:saved.preset};
}

function offsets(e,override='auto'){const scale=override==='auto'?e.scale:override;return e.degrees.map((d,i)=>(scale==='minor'?minor:major)[d-1]+(e.alterations?.[i]||0));}
function bounds(e,low,high,override='auto'){const n=offsets(e,override);return {min:low-Math.min(...n),max:high-Math.max(...n)};}
function route(min,max,direction,start){if(min>max)return [];const s=Math.max(min,Math.min(max,start??(direction==='down'?max:min)));if(direction==='down')return Array.from({length:s-min+1},(_,i)=>s-i);const up=Array.from({length:max-s+1},(_,i)=>s+i);return direction==='back'?[...up,...Array.from({length:max-min},(_,i)=>max-i-1)]:up;}
function note(n){return ['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'][((n%12)+12)%12]+(Math.floor(n/12)-1);}
// Note lengths follow the phrase, without moving its rhythmic onsets.
const connection={a1:1.02,a2:1.02,a3:1.01,a4:1.02,a5:1.02,a6:1.02,a7:1.02,a8:1.01,a9:1.02,a10:1.01,bl1:1.01,bl2:1.02,bl3:1.02,bl4:.94,bl5:1.02,bl6:1.01,bl7:1.01,bl8:1.02,bl9:1.01,bl10:1.03,p1:.95,p2:1.02,p3:.92,p4:1.01,p5:.94,p6:1.01,p7:1.03,p8:1.01,p9:.98,p10:1.02,j1:.94,j2:.98,j3:.98,j4:.96,j5:.96,j6:.99,j7:.96,j8:1.01,j9:1.01,j10:.98,r1:1.03,r2:1.03,r3:1.02,r4:1.03,r5:1.03,r6:1.03,r7:1.03,r8:1.02,r9:1.01,r10:1.03,f1:1.02,f2:1.02,f3:.98,f4:.98,f5:1.02,f6:1.02};
const phraseEnds={bl7:[4]};
function articulation(e,i,duration,rhythm='original'){
 const final=i===e.degrees.length-1,repeated=!final&&offsets(e)[i]===offsets(e)[i+1],boundary=rhythm==='original'&&(phraseEnds[e.id]||[]).includes(i);
 let gate=connection[e.id]||.98;
 if(repeated)gate=.82;
 if(boundary)gate=.86;
 if(final)gate=.92;
 return {duration:duration*gate,release:Math.min(.16,duration*(repeated||boundary?.14:.32)),velocity:gate>=.98?.44:.5};
}
const api={rangePresets,rangeGroup,rangeLimit,presetRange,storedRange,trainingBanks,exercises,offsets,bounds,route,note,articulation};root.Vocal=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
