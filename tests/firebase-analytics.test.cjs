const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function analyticsModule({ env = {}, hostname = 'quickrating.page', server = false, supported = true, failure = false } = {}) {
  const calls = { loads: 0, appLoads: 0, initializations: 0, debug: false };
  const instance = { app: 'test' };
  const exports = {};
  const output = ts.transpileModule(fs.readFileSync('src/lib/firebase/analytics.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(output, {
    exports,
    process: { env: { NODE_ENV: 'production', NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: 'G-TEST123', ...env } },
    ...(server ? {} : { window: { location: { hostname } } }),
    require(id) {
      if (id === 'firebase/analytics') {
        calls.loads++;
        if (failure) throw new Error('SDK unavailable');
        return {
          isSupported: async () => supported,
          getAnalytics: () => { calls.initializations++; return instance; },
          setDefaultEventParameters: params => { calls.debug = params.debug_mode; },
        };
      }
      if (id === './config') { calls.appLoads++; return { firebaseApp: {} }; }
      throw new Error(`Unexpected import: ${id}`);
    },
  });
  return { initialize: exports.initializeFirebaseAnalytics, calls, instance };
}

test('does not load analytics during server rendering', async () => {
  const app = analyticsModule({ server: true });
  assert.equal(await app.initialize(), null);
  assert.equal(app.calls.loads, 0);
});
test('missing measurement ID keeps analytics optional', async () => {
  const app = analyticsModule({ env: { NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: '' } });
  assert.equal(await app.initialize(), null);
  assert.equal(app.calls.loads, 0);
});
test('initializes once across repeated global mounts', async () => {
  const app = analyticsModule();
  const first = app.initialize();
  const second = app.initialize();
  assert.equal(first, second);
  assert.equal(await first, app.instance);
  assert.equal(app.calls.initializations, 1);
});
test('legacy measurement environment variable still enables analytics', async () => {
  const app = analyticsModule({ env: { NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: '', NEXT_PUBLIC_MEASUREMENT_ID: 'G-LEGACY' } });
  assert.equal(await app.initialize(), app.instance);
});
test('unsupported browsers never initialize Firebase', async () => {
  const app = analyticsModule({ supported: false });
  assert.equal(await app.initialize(), null);
  assert.equal(app.calls.appLoads, 0);
});
for (const hostname of ['localhost', '127.0.0.1', '[::1]']) {
  test(`excludes production previews on ${hostname}`, async () => {
    const app = analyticsModule({ hostname });
    assert.equal(await app.initialize(), null);
    assert.equal(app.calls.loads, 0);
  });
}
test('excludes development visits by default', async () => {
  const app = analyticsModule({ env: { NODE_ENV: 'development' } });
  assert.equal(await app.initialize(), null);
  assert.equal(app.calls.loads, 0);
});
test('debug mode explicitly enables local testing', async () => {
  const app = analyticsModule({ hostname: 'localhost', env: { NODE_ENV: 'development', NEXT_PUBLIC_FIREBASE_ANALYTICS_DEBUG: 'true' } });
  assert.equal(await app.initialize(), app.instance);
  assert.equal(app.calls.debug, true);
});
test('SDK errors never reject into the application', async () => {
  const app = analyticsModule({ failure: true });
  assert.equal(await app.initialize(), null);
});
