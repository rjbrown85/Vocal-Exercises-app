# Vocal Exercises

A minimal piano-backed vocal practice app with 172 exercises, a dark theme, and responsive phone, tablet, and desktop layouts.

## Practice

General Warmups has six technique-based banks: Fundamentals, Intervals, Agility, Pentatonic Runs, Major Scale Runs, and Other Scales. Former genre studies retain their notes and rhythms and are organized by pitch content. Agility includes longer patterns and eight short ornaments, turns, trills, and grace-note approaches. Chest Voice, Mix, Head Voice & Falsetto, Belting, and Breath & Sustain add 10 exercises each, with 11 in Breath & Sustain.

Select an exercise and range, then press Play. Exercises move chromatically through the range. General Warmups uses G2–C5 for Baritone and C3–E5 for Tenor. Training sections use focus-specific presets, with separate remembered adjustments by voice type. Belting adjustments stop at C5. These are app presets, not an assessment of your voice.

Volume defaults to 100%, with a maximum of 250%. Existing deliberate volume choices are retained. Six guided Breath & Sustain exercises use seconds or four-beat bars with optional clicks, three rounds and recovery phases, without piano or key changes.

Controls include live tempo, metronome, direction, repeats, hold key, sing together or listen-and-echo, breathing gap, and volume. A sustained chord introduces each key. Piano keys also respond to A W S E D F T G Y H U J K. Preferences stay in browser-local storage. No account, microphone, recordings, analytics, or backend is required.

The training studies use common vocal tasks with original note arrangements and instructions. They are not song transcriptions or branded routines. Belting focuses on moderate-volume foundations. Choose a comfortable range for each task. See [practice notes and references](dist/practice-notes.html).

## Vocal Etudes

The home screen includes **Vocal Etudes**, a separate piano-backed practice space with 20 four-bar progressions and 10 original studies per progression (200 arrangements). The first three are I–V–vi–IV, vi–IV–I–V, and I–vi–IV–V. Seven additional pop progressions include common rotations, a ii-chord turnaround, and a folk-pop loop.

Ten additional progressions draw on David Bennett’s teaching, including Royal Road, the Andalusian cadence, and minor or borrowed-chord loops. Each study uses chord-tone targets, nearby scale notes matched to the harmony, simple rhythmic variations, and marked breaths. Every bar ends with at least one full beat of vocal rest. Shaded breath marks and a timed “Breathe now” cue remain active in all practice modes, including when no extra gap is selected. Melody spans stay within an octave, with no adjacent jump larger than a fourth. The ten styles range from long ballad phrases to syncopated entries and short eighth-note runs. No song transcription, lyrics, or artist imitation is used. These short musical building blocks can still resemble existing music by coincidence.

Controls include all 12 tonic choices in the progression’s major or minor key, three octave registers, 50–150 BPM, 1–4 rounds, breathing gaps, a metronome, and held, broken, or pulsed piano accompaniment. Practice with melody and chords, listen then sing over the same backing, or choose chords only. The displayed range describes the melody, not the accompaniment. Key and tempo changes restart with a four-beat count-in. Leaving the tab stops playback. Preferences use a separate local-storage key and do not change existing warmup settings.

Open `etudes.html` through the home button. Harmony references are linked in its **About the music & references** section. See [implementation and validation notes](notes/vocal-etudes.md).

On iPad, tap Play to start audio. Interrupted or stalled audio returns to a restart prompt. **No sound? → Reset sound and play** creates a fresh audio session if playback remains silent. Tablet layouts use larger touch controls, with a compact etude selector in portrait and narrow windows.

## PJVI official R&B recordings

The home button **PPJI RMB Exercises** opens 20 official PJVI Vocal Studio recordings, with 12 tracks from Volume 1 and eight from Volume 2. Each exercise plays through the creator’s Bandcamp embed with its original audio, key, tempo, and accompaniment. PJVI is credited beside every recording, with links to the original track and both albums.

Choose an exercise, then press Play inside its player. Previous/Next and a compact tablet selector switch exercises. Stop all removes the current player. Switching exercises or leaving the tab stops playback, and Reload recording restores the player. Pause whenever you need a breath. There are no added drums or app controls that alter the recording. Playback availability and listening limits remain controlled by Bandcamp. Internet access is required.

## Run locally

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000 and press Play to enable audio. Use a web server rather than opening the HTML directly so the piano samples load.

## GitHub Pages

In Settings → Pages, choose GitHub Actions as the publishing source. The included workflow checks the exercises and deploys `dist` when `main` changes. It also supports manual runs from Actions.

## Checks

Requires Node.js:

```sh
node --test checks/*.test.cjs
```

Checks cover exercise counts and rhythms, range-safe transposition, chromatic routes, sample loading, and live tempo changes.

## Piano sample credits

Salamander Grand Piano by Alexander Holm, licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). The app bundles 17 unchanged MP3 samples from the [Tone.js audio collection](https://github.com/Tonejs/audio/tree/efd8296360f9526e379bfbe5c1698ff54d6a1d34/salamander), source commit `efd8296360f9526e379bfbe5c1698ff54d6a1d34`. Playback applies pitch shifting, volume, and note-release envelopes. See [original sample documentation](dist/audio/piano/README) and [credits](dist/credits.html).

Source recording: [Salamander Grand Piano V3](https://archive.org/details/SalamanderGrandPianoV3). SFZ v2 remapping by **kinwie**, [repository](https://github.com/sfzinstruments/SalamanderGrandPiano). The app uses the MP3 samples, not the SFZ mapping.

No license for the application source is granted by the sample license.

Slides in Intervals and bends in Agility use a continuous sine synth, with piano cue chords. Changing tempo restarts the current pitched run in the same key when the tempo gesture ends. The open sustain timer counts elapsed seconds until Stop, without a target duration or microphone recording.
