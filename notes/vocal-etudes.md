# Vocal Etudes

## Scope

A separate `etudes.html` entry keeps the established warmup and breathing players unchanged. The home screen adds a seventh, full-width tile. The new player reuses the existing sampled piano and iOS audio-session handling.

The library contains 100 four-bar arrangements. Ten hand-authored rhythmic/scale-step motif templates each contain four shaped bars. Each template is adapted to each progression using chord-tone anchors and close melodic motion. These are deterministic practice studies, not recordings or transcriptions. They are not screened against an exhaustive music catalog, so absolute uniqueness cannot be claimed.

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

`node --test checks/*.test.cjs` includes the existing warmup/audio checks and new etude checks. New coverage verifies the 100-study inventory, bar lengths and rests, chord-tone endings, melody span and leaps, transposition across 12 keys and 3 registers, triad quality and voicing, exact echo/gap timing, guide muting, audio-load races and retry, complete source cancellation, and three accompaniment patterns.

Browser verification uses the ChatGPT in-app browser for home navigation, study selection, piano startup and completion, transposed chord/range labels, echo mode, tempo changes, and phone/desktop layout. Browser playback and clock synchronization are checked, but automated pitch/rhythm checks do not substitute for the user's listening judgment.

## iPad audio follow-up

Audio startup calls `resume()` directly within the Play gesture and times out after four seconds if Safari never resolves it. An interrupted context or frozen audio clock stops the session and offers a restart. The next tap creates a fresh context, reusing decoded piano samples. A manual sound-reset control provides the same recovery when the browser reports playback but the user hears silence. Scheduling looks 400 ms ahead to tolerate brief interface stalls.

The shared audio-session helper reapplies playback mode on each new Play gesture and falls back to the existing silent media element if the Audio Session API setter fails. This helper also serves the original warmups.

All 34 checks pass, including simulated interruptions, stuck resume promises, cancellation during startup, frozen clocks, context replacement, and the iPad desktop-user-agent fallback. Browser checks cover 768×1024 portrait, 1024×768 landscape, and 390×844 narrow layouts, plus the reset control. Physical iPad audio output has not been verified.

Safari behavior references: [WebKit interruption test](https://github.com/WebKit/WebKit/blob/main/LayoutTests/webaudio/audiocontext-state-interrupted.html), [interrupted-context report](https://bugs.webkit.org/show_bug.cgi?id=273511), and [frozen audio-clock report](https://bugs.webkit.org/show_bug.cgi?id=263627). These describe failure modes, not confirmation of the cause on the user's device.
