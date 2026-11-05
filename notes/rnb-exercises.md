# Original R&B exercise player

The hosted Bandcamp section was replaced after the user requested MIDI-style exercises similar in teaching approach to PJVI's videos. The section and home button are titled PJVI, as the user requested. The practice page identifies the exercises as original and credits PJVI as a teaching reference, without claiming official authorship or reproducing the videos' note sequences.

## Sources observed

The opening scores in https://www.youtube.com/watch?v=CFCrhHLkUqo (around 0:11), https://www.youtube.com/watch?v=s4z93zkwhQE (opening score), and https://www.youtube.com/watch?v=pqyDIpurk9Y (around 0:10) show pentatonic figures, connected notes, short rhythmic groupings, and rests before repeats or key changes. Only these three opening examples were visually reviewed. No claim is made to have transcribed all 20 official tracks. YouTube was muted when the user requested it and remained muted for subsequent inspection.

These broad techniques informed 20 newly composed two-bar studies, including small major/minor pentatonic patterns, syncopation, neighboring figures, and short sixteenth-note turns. The melodies are not derived by copying and changing a few notes of the source scores. Drum-reference background: https://thesonicsecrets.com/production/drum-patterns/rnb/.

## Playback and MIDI

`rnb-music.js` owns the study data, arrangement, beat timeline, and SMF exporter. MIDI export and browser playback consume the same note events. Melody, harmony, bass, and drums are placed on a single clock by `RnbPlayer`, a subclass of the existing interruption-aware `EtudePlayer`. It reuses sampled piano loading and cancellation, while synthesizing drum buffers and a soft bass tone. No external audio/iframe is loaded.

Every bar totals four beats and finishes with at least one beat of vocal rest. Phrases remain within an octave, with adjacent jumps no larger than a fifth. Register/key controls and optional rising key sequence show the full melody range before playback. Echo mode suppresses the guide in each response while preserving backing and rest cues. No separate drum timer exists. MIDI has a four-beat percussion count-in and the same full session duration as the app. Browser count-in uses the shared player's click sound.

## Verification

Run `node --test checks/*.test.cjs`. R&B checks cover all 20 melodies, bar totals, breath rests, pitch ranges, all modes and groove choices, MIDI notes/timing/tempo/echo/transposition, simultaneous instrument scheduling, cancellation, tempo restart, and interruption recovery. Browser checks cover controls, exported MIDI, responsive layout, and deployment. Physical iPad audio requires a device check and is not implied by viewport tests.
