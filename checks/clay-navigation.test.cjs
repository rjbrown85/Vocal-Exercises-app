const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync, execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { mkdtemp, readFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { createServer } = require('node:http');

const chrome = 'google-chrome';
const hasChrome = process.platform === 'linux' && spawnSync(chrome, ['--version']).status === 0;

test('seven responsive tiles, player shortcuts, and custom phase navigation in Chrome', {
  skip: hasChrome ? false : 'Requires the Linux Chrome used by the Pages runner'
}, async t => {
  const root = path.resolve(__dirname, '..');
  const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff':'font/woff','.png':'image/png'};
  const server = createServer(async (req, res) => {
    const file = path.resolve(root, '.' + new URL(req.url,'http://localhost').pathname);
    if (!file.startsWith(root + path.sep)) { res.writeHead(404).end(); return; }
    try {
      const data = await readFile(file);
      res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'}).end(data);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((resolve, reject) => { server.once('error',reject); server.listen(0,'127.0.0.1',resolve); });
  t.after(() => server.close());
  const profile = await mkdtemp(path.join(tmpdir(),'vocal-clay-'));
  t.after(() => rm(profile,{recursive:true,force:true}));
  const url = 'http://127.0.0.1:' + server.address().port + '/checks/clay-navigation.html';
  const {stdout} = await promisify(execFile)(chrome, [
    '--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disable-background-networking',
    '--no-first-run', '--user-data-dir=' + profile, '--virtual-time-budget=8000', '--dump-dom', url
  ], {timeout:45000});
  const status = stdout.match(/<output id="result">([\s\S]*?)<\/output>/)?.[1];
  assert.equal(status, 'Passed');
});
