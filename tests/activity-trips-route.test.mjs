import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
test('actual field-trip route distinguishes results, empty search, timeout and provider failure without exposing profiles',()=>{
 const run=spawnSync(process.execPath,['--experimental-test-module-mocks',fileURLToPath(new URL('./fixtures/activity-trips-route.mjs',import.meta.url))],{encoding:'utf8',timeout:20000});
 assert.equal(run.status,0,run.stdout+'\n'+run.stderr);
 assert.match(run.stdout,/PASS actual route/);
});
