const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks = {}) {
  const exports = {};
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(output, {
    exports, console, require(id) {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      throw new Error(`Unexpected import: ${id}`);
    },
  });
  return exports;
}
const backgrounds = load('src/lib/pageBackgrounds.ts');
function setup(existing) {
  let saved;
  const user = existing ? { ...existing, async save() { saved = { ...this }; } } : null;
  class UserModel {
    constructor(data) { Object.assign(this, data); }
    async save() { saved = { ...this }; }
  }
  const { onServerSubmit } = load('src/app/actions/settingsSubmit.ts', {
    '@/lib/pageBackgrounds': backgrounds,
    '@/lib/db/db': { __esModule: true, default: async () => {} },
    '@/lib/db/user': { getUser: async () => user, isCustomLinkExists: async () => ({ isExist: false }) },
    '../../lib/models/server/user': { __esModule: true, default: UserModel },
    '@/lib/services/middleware': { checkAuth: async () => ({ uid: 'test', email: 'owner@example.invalid' }) },
    '@/lib/models/server/email': { sendUserSignedUpEmail: async () => {} },
    'next/navigation': { redirect: () => { throw new Error('REDIRECT'); } },
    'next/cache': { revalidatePath: () => {} },
  });
  return { submit: onServerSubmit, saved: () => saved };
}
function form(background) {
  const data = new FormData();
  data.set('buisnessName', 'Test Business');
  data.set('username', 'testbusiness');
  data.set('color', '#f6c345');
  if (background !== undefined) data.set('pageBackground', background);
  return data;
}
for (const background of backgrounds.PAGE_BACKGROUNDS) {
  test(`saves ${background.id} on new pages`, async () => {
    const app = setup();
    await assert.rejects(app.submit({}, form(background.id)), /REDIRECT/);
    assert.equal(app.saved().pageBackground, background.id);
    assert.equal(app.saved().themeColor, '#f6c345');
  });
  test(`saves ${background.id} on existing pages`, async () => {
    const app = setup({ customLink: 'testbusiness', pageBackground: 'botanical' });
    await app.submit({}, form(background.id));
    assert.equal(app.saved().pageBackground, background.id);
  });
}
test('legacy update forms preserve the existing background', async () => {
  const app = setup({ customLink: 'testbusiness', pageBackground: 'sunrise' });
  await app.submit({}, form());
  assert.equal(app.saved().pageBackground, 'sunrise');
});
test('existing pages without a background keep the classic appearance', async () => {
  const app = setup({ customLink: 'testbusiness' });
  await app.submit({}, form());
  assert.equal(app.saved().pageBackground, 'classic');
  assert.equal(backgrounds.normalizePageBackground(undefined), 'classic');
});
test('rejects unknown backgrounds instead of storing arbitrary styles or URLs', async () => {
  const app = setup({ customLink: 'testbusiness' });
  const result = await app.submit({}, form('url(https://example.invalid/image.png)'));
  assert.match(result.errors[0], /background/);
  assert.equal(app.saved(), undefined);
  assert.equal(backgrounds.getPageBackgroundStyle('unknown'), backgrounds.PAGE_BACKGROUNDS[0].style);
});
test('public-page queries retain the saved background', async () => {
  const model = { aggregate: async pipeline => {
    const projection = pipeline.find(stage => stage.$project).$project;
    const row = { reviews: [], payments: [], pageBackground: 'starlight' };
    return [Object.fromEntries(Object.entries(row).filter(([field]) => projection[field]))];
  } };
  const { getReviewPage } = load('src/lib/db/user.ts', {
    'server-only': {},
    '../constants': { __esModule: true, default: { freeReviewLimit: 15 } },
    '../models/server/payment': { isSubcriptionValid: () => false },
    '../models/server/user': { __esModule: true, default: model },
    '../models/server/trial-page': {},
    mongoose: {},
  });
  assert.equal((await getReviewPage('testbusiness')).pageBackground, 'starlight');
});
