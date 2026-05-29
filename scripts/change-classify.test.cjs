const test = require('node:test');
const assert = require('node:assert/strict');
const {
  isDocsOnlyFile,
  isMigrationsOnlyFile,
  classifyChanges,
} = require('./change-classify.cjs');

test('isDocsOnlyFile: changelog, changeset, cursor, agents, markdown', () => {
  assert.equal(isDocsOnlyFile('CHANGELOG.md'), true);
  assert.equal(isDocsOnlyFile('.changeset/foo.md'), true);
  assert.equal(isDocsOnlyFile('documentation/DOC.md'), true);
  assert.equal(isDocsOnlyFile('.cursor/skills/x.md'), true);
  assert.equal(isDocsOnlyFile('.agents/skills/plan/SKILL.md'), true);
  assert.equal(isDocsOnlyFile('README.md'), true);
  assert.equal(isDocsOnlyFile('src/foo.ts'), false);
});

test('isMigrationsOnlyFile: migrations dir and seed only', () => {
  assert.equal(
    isMigrationsOnlyFile(
      'supabase/migrations/20260528130000_example.sql',
    ),
    true,
  );
  assert.equal(isMigrationsOnlyFile('supabase/seed.sql'), true);
  assert.equal(isMigrationsOnlyFile('supabase/functions/foo/index.ts'), false);
  assert.equal(isMigrationsOnlyFile('src/foo.ts'), false);
});

test('classifyChanges: docs-only', () => {
  assert.deepEqual(
    classifyChanges(['CHANGELOG.md', '.cursor/foo.md']),
    {light: true, kind: 'docs'},
  );
});

test('classifyChanges: agents skills docs-only', () => {
  assert.deepEqual(
    classifyChanges(['.agents/skills/finish/SKILL.md']),
    {light: true, kind: 'docs'},
  );
});

test('classifyChanges: migrations-only', () => {
  const staged = [
    'supabase/migrations/20260528130000_a.sql',
    'supabase/migrations/20260528130100_b.sql',
  ];
  assert.deepEqual(classifyChanges(staged), {
    light: true,
    kind: 'migrations',
  });
});

test('classifyChanges: mixed docs + sql is no-src', () => {
  assert.deepEqual(
    classifyChanges([
      'supabase/migrations/20260528130000_a.sql',
      '.changeset/x.md',
    ]),
    {light: true, kind: 'no-src'},
  );
});

test('classifyChanges: src change is not light', () => {
  assert.deepEqual(classifyChanges(['src/features/example/foo.ts']), {
    light: false,
    kind: null,
  });
});

test('classifyChanges: empty is not light', () => {
  assert.deepEqual(classifyChanges([]), {light: false, kind: null});
});

test('classifyChanges: hooks/scripts without src is no-src', () => {
  assert.deepEqual(
    classifyChanges([
      '.husky/pre-commit',
      'package.json',
      'scripts/is-staged-precommit-light.js',
      'scripts/change-classify.cjs',
    ]),
    {light: true, kind: 'no-src'},
  );
});

test('classifyChanges: src plus docs is full path', () => {
  assert.deepEqual(
    classifyChanges(['src/pages/Home.tsx', 'documentation/DOC.md']),
    {light: false, kind: null},
  );
});
