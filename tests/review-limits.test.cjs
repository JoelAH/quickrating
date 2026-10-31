const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Execute the actual server modules with database/email boundaries replaced.
function load(file, mocks = {}) {
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(output, {
    exports, console, Date, Math, require(id) {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      throw new Error(`Unexpected dependency: ${id}`);
    },
  }, { filename: file });
  return exports;
}
const constants = load('src/lib/constants.ts').default;
function form(values) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}
function setup(count, subscribed) {
  let saves = 0;
  let emails = 0;
  const page = { businessName: 'Example', email: 'owner@example.com', isSubscribed: subscribed };
  class ReviewModel {
    constructor(data) { Object.assign(this, data); this._id = 'review'; }
    async save() { saves++; return this; }
    static async countDocuments() { return count; }
    static async findOne() { return new ReviewModel({}); }
  }
  const mocks = {
    '@/lib/constants': { default: constants, __esModule: true },
    '@/lib/db/db': { default: async () => {}, __esModule: true },
    '@/lib/db/user': { getUserWithPayment: async () => page },
    '@/lib/db/review': { getReviews: async () => Array.from({ length: count }, () => ({ reviewer: {} })) },
    '@/lib/models/server/email': { sendReviewCode: async () => { emails++; return true; }, sendReviewEmailToBusiness: async () => { emails++; } },
    fakefilter: { isFakeEmail: () => false },
    '../../lib/models/server/review': { default: ReviewModel, __esModule: true },
    '@/lib/models/auth': { normalizeEmail: email => email.toLowerCase() },
    mongoose: { Types: { ObjectId: class { constructor(value) { this.value = value; } } } },
  };
  return { mocks, state: () => ({ saves, emails }) };
}
for (const [count, paid, allowed] of [[3, false, true], [14, false, true], [15, false, false], [20, true, true]]) {
  test(`request review: ${count} existing, paid=${paid}, allowed=${allowed}`, async () => {
    const env = setup(count, paid);
    const { onInitiateCode } = load('src/app/actions/sendCode.ts', env.mocks);
    const result = await onInitiateCode({}, form({ id: 'page', name: 'Customer', rating: '5', comment: 'Good service', email: 'customer@example.com' }));
    assert.equal(result.success === true, allowed);
    assert.equal(env.state().saves, allowed ? 1 : 0);
    assert.equal(env.state().emails, allowed ? 1 : 0);
  });
}
for (const [count, paid, allowed] of [[14, false, true], [15, false, false], [20, true, true]]) {
  test(`confirm review: ${count} existing, paid=${paid}, allowed=${allowed}`, async () => {
    const env = setup(count, paid);
    const { onConfirmCode } = load('src/app/actions/confirmCode.ts', env.mocks);
    const result = await onConfirmCode({}, form({ pageId: 'page', reviewId: 'review', confirmCode: '123456' }));
    assert.equal(result.success === true, allowed);
    assert.equal(env.state().saves, allowed ? 1 : 0);
  });
}
for (const [count, paid, displayed, maxed] of [[3, false, 3, false], [14, false, 14, false], [15, false, 15, true], [18, false, 15, true], [18, true, 18, false]]) {
  test(`public page: ${count} reviews, paid=${paid}, displays ${displayed}`, async () => {
    const userModel = { aggregate: async () => [{ reviews: Array.from({ length: count }, (_, id) => ({ id })), payments: paid ? [{}] : [] }] };
    const { getReviewPage } = load('src/lib/db/user.ts', {
      'server-only': {}, '../constants': { default: constants, __esModule: true },
      '../models/server/payment': { isSubcriptionValid: () => paid },
      '../models/server/user': { default: userModel, __esModule: true },
      '../models/server/trial-page': {}, mongoose: {},
    });
    const result = await getReviewPage('example');
    assert.equal(result.reviews.length, displayed);
    assert.equal(result.maxedReviews, maxed);
  });
}
test('free allowance and temporary trial stay distinct', () => {
  assert.equal(constants.freeReviewLimit, 15);
  assert.equal(constants.trialPages.maxReviews, 3);
});
test('SEO describes the real plan without invented product ratings or search', () => {
  const schema = load('src/lib/structuredData.ts', { './constants': { default: constants, __esModule: true } });
  const software = schema.generateSoftwareApplicationSchema();
  assert.equal(software.aggregateRating, undefined);
  assert.match(software.offers[0].description, /15 reviews/);
  assert.equal(schema.generateWebsiteSchema().potentialAction, undefined);
});
test('SEO excludes unrated reviews from star averages and never invents five stars', () => {
  const schema = load('src/lib/structuredData.ts', { './constants': { default: constants, __esModule: true } });
  const business = schema.generateLocalBusinessSchema({ businessName: 'Example', customLink: 'example', reviews: [{ rating: 5 }, { rating: -1 }] });
  assert.equal(business.aggregateRating.ratingValue, '5.0');
  assert.equal(business.aggregateRating.ratingCount, 1);
  assert.equal(schema.generateReviewSchema({ reviewer: { name: 'Customer' }, rating: -1 }, 'Example').reviewRating, undefined);
});
