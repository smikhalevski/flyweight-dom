import { expect, test } from 'vitest';
import { h } from '../main/dsl.ts';
import { getElementById } from '../main/getElementById.ts';

test('returns the element with the given ID', () => {
  const root = h.document(h('xxx', h('yyy'), h('zzz', { id: 'aaa' })));

  expect(getElementById(root, 'aaa')).toBe(root.childNodes[0].childNodes[1]);
});

test('returns null if ID is empty', () => {
  expect(getElementById(h.document(h('aaa')), '')).toBeNull();
});

test('returns null if there is no element with the given ID', () => {
  expect(getElementById(h('aaa', h('bbb', { id: 'ccc' })), 'ddd')).toBeNull();
});
