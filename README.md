# Vocal Exercises

A minimal piano-backed vocal practice app with 56 original exercises, a dark theme, and responsive phone, tablet, and desktop layouts.

## Practice

Choose from 6 fundamentals, 10 Boyd-inspired studies, 10 Cuomo-inspired studies, 10 R&B exercises, and 10 Jazz Licks.

Select an exercise and range, then press Play. Exercises move chromatically through the range. Baritone starts at G2–C5 and Tenor at C3–E5. Both allow custom limits. These are app presets, not an assessment of your voice.

Controls include live tempo, metronome, direction, repeats, hold key, sing together or listen-and-echo, breathing gap, and volume. A sustained chord introduces each key. Piano keys also respond to A W S E D F T G Y H U J K. Preferences stay in browser-local storage. No account, microphone, recordings, analytics, or backend is required.

Artist-inspired exercises are original interpretations, not song transcriptions or verified signature melodies. Research notes are in [notes/style-studies.md](notes/style-studies.md).

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

No license for the application source is granted by the sample license.
