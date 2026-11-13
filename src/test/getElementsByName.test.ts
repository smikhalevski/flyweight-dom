import { expect, test } from 'vitest';
import { h } from '../main/dsl.ts';
import { getElementsByName } from '../main/getElementsByName.ts';

test('returns elements with the given name', () => {
  const root = h.document(h('xxx', { name: 'aaa' }, h('yyy'), h('zzz', { name: 'aaa' })));

  expect(getElementsByName(root, 'aaa')).toStrictEqual([root.childNodes[0], root.childNodes[0].childNodes[1]]);
});
