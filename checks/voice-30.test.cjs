const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const html = readFileSync(require.resolve('../dist/voice-30.html'), 'utf8');
const scripts = [...html.matchAll(/<script(?: id="routine")?>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const model = new vm.Script(scripts[0] + '\n;({phases, routes, secondsFor, buildPhrase, countCue, weekCount});').runInNewContext();
const { buildPhrase, countCue } = model;

test('both schedules use the full drill durations and exclude the water break', () => {
  assert.equal(model.secondsFor('full'), 1800);
  assert.equal(model.secondsFor('short'), 780);
  assert.deepEqual(Array.from(model.routes.short, i => model.phases[i].name), ['Breath','SOVT','Cool-down']);
});

test('piano patterns preserve intervals, transpose by half steps, and restart within range', () => {
  const expected = {arp:[0,4,7,12,16,19,16,12,7,4,0], scale:[0,2,4,5,7,5,4,2,0], triad:[0,4,7,4,0]};
  for (const [id, pattern] of Object.entries(expected)) {
    const root = 45, top = root + Math.max(...pattern) + 2;
    for (let r = 0; r < 6; r++) {
      const result = buildPhrase(id, root, top, r);
      assert.deepEqual(Array.from(result.notes), pattern.map(n => root + r % 3 + n));
    }
    assert.equal(buildPhrase(id, root, root + Math.max(...pattern) - 1, 0), null);
  }
  assert.equal(buildPhrase('octave', 55, 66, 0), null);
  assert.deepEqual(Array.from(buildPhrase('octave', 55, 67, 0).notes), [67,55]);
  assert.deepEqual(Array.from(buildPhrase('siren', 45, 72, 0).notes), [45,72,45]);
  assert.deepEqual(Array.from(buildPhrase('cool', 45, 72, 0).notes), [58,45]);
  assert.equal(buildPhrase('upper', 70, 72, 0).notes[0], 72);
  assert.equal(buildPhrase('vowel', 45, 72, 1).notes[0] - buildPhrase('vowel', 45, 72, 0).notes[0], 1);
});

test('hiss, pulses, and six-second swell switch at the correct boundaries', () => {
  for (const count of [12,16,20]) {
    assert.equal(countCue('hiss', 0, count), 'Inhale · 1 / 4');
    assert.equal(countCue('hiss', 4, count), 'Hiss · 1 / ' + count);
    assert.equal(countCue('hiss', 4 * (4 + count), count), 'Rest');
  }
  assert.equal(countCue('pulse', 7, 12), 'Shh · 4 / 4');
  assert.equal(countCue('pulse', 15, 12), 'Sustain · 8 / 8');
  assert.equal(countCue('upper', 3, 12), 'Taper · 1 / 3');
  assert.equal(countCue('swell', 6, 12), 'Swell · 1 / 3');
});

test('only full sessions count from Monday midnight through now, in local time', () => {
  const now = new Date(2026, 10, 22, 10);
  const monday = +new Date(2026, 10, 16);
  const rows = [
    {kind:'Full',finished:monday}, {kind:'Full',finished:monday - 1},
    {kind:'Partial',finished:+now}, {kind:'Short',finished:+now}, {kind:'Full',finished:+now + 1}
  ];
  assert.equal(model.weekCount(rows, now), 1);
});

function timerHarness() {
  let ms = 0;
  const context = vm.createContext({
    document: {hidden:false, getElementById:() => ({showModal(){}})},
    performance: {now:() => ms}, crypto: {randomUUID:() => 'session-id'},
    clearInterval(){}, setInterval(){}, Date
  });
  // Run the shipped controller against a fake clock without user-interface setup.
  const setup = scripts[1].slice(0, scripts[1].indexOf('    readPref();'));
  vm.runInContext(scripts[0] + '\n' + setup + `
    [show,presentStep,persistTab,paintTime,keepAwake,releaseWake,stopAudio,openLog,goHome] = Array(9).fill(() => {});
  `, context);
  return { run:s => vm.runInContext(s, context), advance:s => { ms += s * 1000; context.tick(); } };
}

test('clock rolls across drills, pauses when hidden, and stops without creating a check-in', () => {
  const h = timerHarness();
  h.run('startRun()');
  h.advance(61.5);
  assert.equal(h.run('stepNow()[0]'), 'hiss');
  assert.equal(h.run('stepElapsed()'), 1.5);
  h.run('document.hidden = true; background()');
  h.advance(100);
  assert.equal(h.run('stepElapsed()'), 1.5);
  h.run('document.hidden = false; startTicker()');
  h.advance(238.5);
  assert.equal(h.run('phaseNow().name'), 'SOVT');
  h.run('stopRun()');
  assert.equal(h.run('run'), null);
  assert.equal(h.run('draft'), null);
  assert.equal(h.run('waterUntil'), 0);
});

test('finishing full, short, and early sessions produces distinct log entries', () => {
  for (const [short, skip, expectedSeconds, kind] of [[false,false,1800,'Full'],[true,false,780,'Short'],[false,true,1740,'Partial']]) {
    const h = timerHarness();
    h.run('prefs.short = ' + short + '; startRun()');
    if (skip) h.run('advance(true)');
    h.advance(expectedSeconds);
    assert.equal(h.run('run'), null);
    assert.equal(h.run('draft.kind'), kind);
    assert.equal(h.run('draft.seconds'), expectedSeconds);
    assert.equal(h.run('waterUntil - draft.finished'), 120000);
  }
});
