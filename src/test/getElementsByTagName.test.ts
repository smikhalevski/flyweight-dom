import { expect, test } from 'vitest';
import { f } from '../main/dsl.js';
import { getElementsByTagName } from '../main/index.js';

test('returns elements with the given ID', () => {
  const root = f.doc(f.xxx(f.yyy(), f.zzz()), f.zzz());

  expect(getElementsByTagName(root, 'zzz')).toStrictEqual([root.childNodes[0].childNodes[1], root.childNodes[1]]);
});

test('returns all elements', () => {
  const root = f.doc(f.xxx(f.yyy(), f.zzz()), f.zzz());

  expect(getElementsByTagName(root, '*')).toStrictEqual([
    root.childNodes[0],
    root.childNodes[0].childNodes[0],
    root.childNodes[0].childNodes[1],
    root.childNodes[1],
  ]);
});
