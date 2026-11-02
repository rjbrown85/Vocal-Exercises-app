# Vocal Etudes

## Scope

A separate `etudes.html` entry keeps the established warmup and breathing players unchanged. The home screen adds a seventh, full-width tile. The new player reuses the existing sampled piano and iOS audio-session handling.

The library contains 200 four-bar arrangements. Ten hand-authored rhythmic/scale-step motif templates each contain four shaped bars. Each template is adapted to each progression using chord-tone anchors and close melodic motion. These are deterministic practice studies, not recordings or transcriptions. They are not screened against an exhaustive music catalog, so absolute uniqueness cannot be claimed.

## Harmony references

- Open Music Theory, “Four-Chord Schemas”: https://human.libretexts.org/Bookshelves/Music/Music_Theory/Open_Music_Theory_2e_(Gotham_et_al.)/07%3A_Popular_Music/7.09%3A_Four-Chord_Schemas
  Supports I–V–vi–IV, vi–IV–I–V, I–vi–IV–V, I–vi–ii–V, IV–V–I–vi, IV–I–V–vi, and IV–V–vi–I.
- Willis Wonderland Foundation, *Musical Wonders*, “Common Chord Progressions” handout: https://williswonderland.org/wp-content/uploads/2024/07/HandoutbookOfficial.pdf
  Supports I–IV–V–IV and ii–IV–I–V. Four-chord progression here means four chord slots, which can repeat a chord.
- Jonny Kaine, “Popular Chord Progressions: I - IV - vi - V” (2014): https://www.youtube.com/watch?v=NB6w185ADgg
  Supports I–IV–vi–V.

References were used only to select harmonic formulas. Melody templates and instructions were composed for this app.

## Playback design

`etudes-music.js` builds a pure beat-based arrangement and session timeline. Chords use compact inversions in an accompaniment register independent of the singer's octave. `etudes-player.js` schedules sampled notes on the audio clock, with a short lookahead and tracked cancellable sources. A generation guard prevents delayed sample loads from restarting a cancelled session. Echo mode repeats the same chord sequence with the melody guide silent on the response. Finite rounds avoid unintended endless playback. Backgrounding or leaving the page stops the session. Changing musical settings restarts the count-in, while volume changes apply immediately.

## Validation

`node --test checks/*.test.cjs` includes the existing warmup/audio checks and new etude checks. New coverage verifies the 200-study inventory, bar lengths and rests, chord-tone endings, melody span and leaps, transposition across 12 keys and 3 registers, triad quality and voicing, exact echo/gap timing, guide muting, audio-load races and retry, complete source cancellation, and three accompaniment patterns.

Browser verification uses the ChatGPT in-app browser for home navigation, study selection, piano startup and completion, transposed chord/range labels, echo mode, tempo changes, and phone/desktop layout. Browser playback and clock synchronization are checked, but automated pitch/rhythm checks do not substitute for the user's listening judgment.

## iPad audio follow-up

Audio startup calls `resume()` directly within the Play gesture and times out after four seconds if Safari never resolves it. An interrupted context or frozen audio clock stops the session and offers a restart. The next tap creates a fresh context, reusing decoded piano samples. A manual sound-reset control provides the same recovery when the browser reports playback but the user hears silence. Scheduling looks 400 ms ahead to tolerate brief interface stalls.

The shared audio-session helper reapplies playback mode on each new Play gesture and falls back to the existing silent media element if the Audio Session API setter fails. This helper also serves the original warmups.

The initial iPad follow-up passed 34 checks, including simulated interruptions, stuck resume promises, cancellation during startup, frozen clocks, context replacement, and the iPad desktop-user-agent fallback. Browser checks cover 768×1024 portrait, 1024×768 landscape, and 390×844 narrow layouts, plus the reset control. Physical iPad audio output has not been verified.

Safari behavior references: [WebKit interruption test](https://github.com/WebKit/WebKit/blob/main/LayoutTests/webaudio/audiocontext-state-interrupted.html), [interrupted-context report](https://bugs.webkit.org/show_bug.cgi?id=273511), and [frozen audio-clock report](https://bugs.webkit.org/show_bug.cgi?id=263627). These describe failure modes, not confirmation of the cause on the user's device.


## David Bennett expansion and vocal breathing

Progressions 11–20 add ten harmonic formulas, each with the existing ten original vocal motif templates. All 200 arrangements now finish every bar with at least one beat of vocal rest. A shaded region and breath mark show the space before playback, and a timed cue marks the breath during melody, echo, and backing-only passes. Selecting no extra gap removes only the interval between passes, never the phrase breaths. Accompaniment continues under these vocal rests.

References and formulas:

- [Japan’s favourite chord progression and why it works](https://www.youtube.com/watch?v=6aezSL_GvZA), David Bennett. The opening transcript identifies 4–5–3–6. The app uses the basic IV–V–iii–vi triads.
- [Songs that use the Andalusian Cadence](https://www.youtube.com/watch?v=_g9r-zRcxI0), David Bennett. The app uses i–♭VII–♭VI–V. Bennett’s [ArtMaster course](https://www.artmaster.com/course/piano-2), lesson 16, also explicitly lists Am–G–F–E.
- [14 Sad Chord Progressions](https://www.pianote.com/blog/sad-chord-progressions/), credited to David Bennett and Pianote. Sections 2–8 and 11 supply i–♭VI–♭III–V, I–III–IV–iv, i–i–♭VI–V, i–♭III–IV–♭VI, i–iv–♭III–V, i–♭VII–iv–i, i–♭III–v–♭VI, and i–♭VII–iv–V. Minor-key numerals are normalized to major-referenced flats. For the harmonic vamp, the article’s roman V is used rather than its inconsistent C-major letter example in A minor. This gives E major in A minor.

Only harmonic formulas are taken from the references. Song names, signature melodic phrases, rhythms, and recordings are not reused. Neutral titles describe the practice material. Every chord occupies one four-beat bar, and repeated chord slots remain intentional.

The harmony model now represents each chord’s root and quality independently. Melodies use a major or minor base scale with local chord tones adjusted for borrowed chords and major dominants. Whole-phrase anchor selection limits every adjacent melody jump to five semitones and keeps the total span within an octave. The melody labels spell the local chord tones, including raised leading notes and borrowed notes, in the selected key.

Validation adds inventory and exact chord-formula checks, all-key/register transposition for all 200 arrangements, chromatic chord-tone endings, and four non-overlapping breath intervals in every study and practice mode. Browser verification includes new minor-key playback in A minor, echo with no extra gap, visible timed breathing cues, and tablet layouts.
