import { expect, test } from 'vitest';
import { h } from '../main/dsl.ts';
import { getElementsByTagName } from '../main/getElementsByTagName.ts';

test('returns elements with the given tag name', () => {
  const root = h.document(h('xxx', h('yyy'), h('zzz')), h('zzz'));

  expect(getElementsByTagName(root, 'zzz')).toStrictEqual([root.childNodes[0].childNodes[1], root.childNodes[1]]);
});

test('returns all elements if the tag name is *', () => {
  const root = h.document(h('xxx', h('yyy'), h('zzz')), h('zzz'));

  expect(getElementsByTagName(root, '*')).toStrictEqual([
    root.childNodes[0],
    root.childNodes[0].childNodes[0],
    root.childNodes[0].childNodes[1],
    root.childNodes[1],
  ]);
});
