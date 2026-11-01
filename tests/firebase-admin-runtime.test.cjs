const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

// Isolate the missing API in a subprocess so other tests retain the real runtime.
test('Firebase Admin and both JWT dependency branches work without SlowBuffer', () => {
  const script = `
    const assert = require('node:assert/strict');
    const path = require('node:path');
    require('node:buffer').SlowBuffer = undefined;

    const { getAuth } = require('firebase-admin/auth');
    const { getStorage } = require('firebase-admin/storage');
    assert.equal(typeof getAuth, 'function');
    assert.equal(typeof getStorage, 'function');

    const jwt = require('jsonwebtoken');
    const secret = 'local-regression-test-only';
    const token = jwt.sign({ sub: 'test-user' }, secret, { expiresIn: '5m' });
    assert.equal(jwt.verify(token, secret).sub, 'test-user');
    assert.throws(() => jwt.verify(token, 'incorrect-secret'), /invalid signature/);

    // Google authentication uses the other jws/jwa major version.
    const jws = require(require.resolve('jws', {
      paths: [path.dirname(require.resolve('google-auth-library'))],
    }));
    const signature = jws.sign({ header: { alg: 'HS256' }, payload: 'test', secret });
    assert.equal(jws.verify(signature, 'HS256', secret), true);
    assert.equal(jws.verify(signature, 'HS256', 'incorrect-secret'), false);
  `;
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: require('node:path').resolve(__dirname, '..'),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
});
