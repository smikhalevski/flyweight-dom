import { beforeEach, expect, test, vi } from 'vitest';

beforeEach(() => {
  // Modules are evaluated again, so each test imports an entry point before any other module
  vi.resetModules();
});

test('the main entry point can be imported on its own', async () => {
  await expect(import('../main/index.ts')).resolves.toBeDefined();
});

test('the DSL entry point can be imported on its own', async () => {
  await expect(import('../main/dsl.ts')).resolves.toBeDefined();
});

test('the query entry point can be imported on its own', async () => {
  await expect(import('../main/query.ts')).resolves.toBeDefined();
});
