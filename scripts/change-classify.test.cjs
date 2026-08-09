const {describe, test} = require('node:test');
const assert = require('node:assert/strict');
const {
  isDocsOnlyFile,
  isMigrationsOnlyFile,
  classifyChanges,
  classifyTestRun,
  getFullSuiteSrcThreshold,
} = require('./change-classify.cjs');

describe('change-classify', () => {
  describe('isDocsOnlyFile', () => {
    test('should match changelog, changeset, cursor, agents, and markdown', () => {
      assert.equal(isDocsOnlyFile('CHANGELOG.md'), true);
      assert.equal(isDocsOnlyFile('.changeset/foo.md'), true);
      assert.equal(isDocsOnlyFile('documentation/DOC.md'), true);
      assert.equal(isDocsOnlyFile('.cursor/skills/x.md'), true);
      assert.equal(isDocsOnlyFile('.agents/skills/plan/SKILL.md'), true);
      assert.equal(isDocsOnlyFile('README.md'), true);
      assert.equal(isDocsOnlyFile('src/foo.ts'), false);
    });
  });

  describe('isMigrationsOnlyFile', () => {
    test('should match migrations dir and seed only', () => {
      assert.equal(
        isMigrationsOnlyFile(
          'supabase/migrations/20260528130000_example.sql',
        ),
        true,
      );
      assert.equal(isMigrationsOnlyFile('supabase/seed.sql'), true);
      assert.equal(
        isMigrationsOnlyFile('supabase/functions/foo/index.ts'),
        false,
      );
      assert.equal(isMigrationsOnlyFile('src/foo.ts'), false);
    });
  });

  describe('classifyChanges', () => {
    test('should return docs light path for docs-only staged files', () => {
      assert.deepEqual(
        classifyChanges(['CHANGELOG.md', '.cursor/foo.md']),
        {light: true, kind: 'docs'},
      );
    });

    test('should return docs light path for agents skills docs', () => {
      assert.deepEqual(
        classifyChanges(['.agents/skills/finish/SKILL.md']),
        {light: true, kind: 'docs'},
      );
    });

    test('should return migrations light path for migrations-only', () => {
      const staged = [
        'supabase/migrations/20260528130000_a.sql',
        'supabase/migrations/20260528130100_b.sql',
      ];
      assert.deepEqual(classifyChanges(staged), {
        light: true,
        kind: 'migrations',
      });
    });

    test('should return no-src when docs and sql are mixed', () => {
      assert.deepEqual(
        classifyChanges([
          'supabase/migrations/20260528130000_a.sql',
          '.changeset/x.md',
        ]),
        {light: true, kind: 'no-src'},
      );
    });

    test('should not be light when src changes are staged', () => {
      assert.deepEqual(classifyChanges(['src/features/example/foo.ts']), {
        light: false,
        kind: null,
      });
    });

    test('should not be light when nothing is staged', () => {
      assert.deepEqual(classifyChanges([]), {light: false, kind: null});
    });

    test('should return no-src for non-infra scripts without src', () => {
      assert.deepEqual(
        classifyChanges([
          'scripts/validate-version-sync.js',
          'documentation/DOC.md',
        ]),
        {light: true, kind: 'no-src'},
      );
    });

    test('should not be light when test-infra files are staged', () => {
      assert.deepEqual(
        classifyChanges([
          '.husky/pre-commit',
          'package.json',
          'scripts/is-staged-precommit-light.js',
          'scripts/change-classify.cjs',
        ]),
        {light: false, kind: null},
      );
    });

    test('should not be light when architecture validator scripts are staged', () => {
      assert.deepEqual(
        classifyChanges(['scripts/validate-staged.js']),
        {light: false, kind: null},
      );
    });

    test('should not be light when src and docs are staged together', () => {
      assert.deepEqual(
        classifyChanges(['src/pages/Home.tsx', 'documentation/DOC.md']),
        {light: false, kind: null},
      );
    });

    test('should not be light when vitest config alone is staged', () => {
      assert.deepEqual(classifyChanges(['vitest.config.ts']), {
        light: false,
        kind: null,
      });
    });
  });

  describe('classifyTestRun', () => {
    test('should skip vitest when nothing is staged', () => {
      assert.deepEqual(classifyTestRun([]), {
        mode: 'skip-vitest',
        reason: 'no staged files',
      });
    });

    test('should force full mode when env override is set', () => {
      const prev = process.env.PRECOMMIT_TEST_FULL;
      process.env.PRECOMMIT_TEST_FULL = '1';
      try {
        assert.deepEqual(classifyTestRun(['src/features/example/foo.ts']), {
          mode: 'full',
          reason: 'env override',
        });
      } finally {
        if (prev === undefined) {
          delete process.env.PRECOMMIT_TEST_FULL;
        } else {
          process.env.PRECOMMIT_TEST_FULL = prev;
        }
      }
    });

    test('should force full mode for trigger files', () => {
      assert.equal(classifyTestRun(['package.json']).mode, 'full');
      assert.equal(classifyTestRun(['pnpm-lock.yaml']).mode, 'full');
      assert.equal(classifyTestRun(['tsconfig.app.json']).mode, 'full');
      assert.equal(classifyTestRun(['vitest.config.ts']).mode, 'full');
      assert.equal(classifyTestRun(['tests/setup.ts']).mode, 'full');
    });

    test('should force full mode for shared kernel changes', () => {
      assert.deepEqual(classifyTestRun(['src/shared/utils/dateFormatters.ts']), {
        mode: 'full',
        reason: 'src/shared kernel',
      });
    });

    test('should return related mode for staged src files', () => {
      assert.deepEqual(
        classifyTestRun(['src/features/auth/services/authService.ts']),
        {
          mode: 'related',
          reason: 'staged src files',
          relatedPaths: ['src/features/auth/services/authService.ts'],
        },
      );
    });

    test('should return related mode for staged test files', () => {
      assert.deepEqual(
        classifyTestRun(['src/features/auth/services/authService.test.ts']),
        {
          mode: 'related',
          reason: 'staged test files',
          relatedPaths: ['src/features/auth/services/authService.test.ts'],
        },
      );
    });

    test('should use related at threshold boundary and full above it for src', () => {
      const threshold = getFullSuiteSrcThreshold();
      const relatedPaths = Array.from(
        {length: threshold},
        (_, i) => `src/features/example/f${i}.ts`,
      );
      assert.equal(classifyTestRun(relatedPaths).mode, 'related');
      const fullPaths = [
        ...relatedPaths,
        `src/features/example/f${threshold}.ts`,
      ];
      assert.equal(classifyTestRun(fullPaths).mode, 'full');
    });

    test('should force full when staged test file count exceeds threshold', () => {
      const threshold = getFullSuiteSrcThreshold();
      const testPaths = Array.from(
        {length: threshold + 1},
        (_, i) => `src/features/example/f${i}.test.ts`,
      );
      assert.deepEqual(classifyTestRun(testPaths), {
        mode: 'full',
        reason: 'staged test file count exceeds threshold',
      });
    });

    test('should prefer full trigger over related src', () => {
      assert.equal(
        classifyTestRun(['package.json', 'src/features/example/foo.ts']).mode,
        'full',
      );
    });

    test('should return node-scripts-only for scripts without app surface', () => {
      assert.deepEqual(classifyTestRun(['scripts/validate-version-sync.js']), {
        mode: 'node-scripts-only',
        reason: 'scripts only',
      });
    });

    test('should skip vitest for docs-only staged files', () => {
      assert.deepEqual(classifyTestRun(['CHANGELOG.md']), {
        mode: 'skip-vitest',
        reason: 'no app test surface',
      });
    });

    test('should force full for supabase edge functions', () => {
      assert.deepEqual(
        classifyTestRun(['supabase/functions/hello/index.ts']),
        {
          mode: 'full',
          reason: 'supabase edge function surface',
        },
      );
    });

    test('should normalize backslash paths', () => {
      const result = classifyTestRun([
        'src\\features\\auth\\services\\authService.ts',
      ]);
      assert.deepEqual(result.relatedPaths, [
        'src/features/auth/services/authService.ts',
      ]);
    });

    test('should honor PRECOMMIT_SRC_THRESHOLD env override', () => {
      const prev = process.env.PRECOMMIT_SRC_THRESHOLD;
      process.env.PRECOMMIT_SRC_THRESHOLD = '2';
      try {
        const paths = [
          'src/features/example/a.ts',
          'src/features/example/b.ts',
          'src/features/example/c.ts',
        ];
        assert.equal(classifyTestRun(paths).mode, 'full');
      } finally {
        if (prev === undefined) {
          delete process.env.PRECOMMIT_SRC_THRESHOLD;
        } else {
          process.env.PRECOMMIT_SRC_THRESHOLD = prev;
        }
      }
    });

    test('should agree with classifyChanges on test-infra files', () => {
      const staged = ['.husky/pre-commit'];
      assert.deepEqual(classifyChanges(staged), {light: false, kind: null});
      assert.equal(classifyTestRun(staged).mode, 'full');
    });
  });
});
