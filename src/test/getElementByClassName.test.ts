import { expect, test } from 'vitest';
import { f } from '../main/dsl.js';
import { getElementsByClassName } from '../main/index.js';

test('returns elements with the given class name', () => {
  const root = f.doc(f.xxx({ class: 'vvv aaa' }, f.yyy(), f.zzz({ class: 'aaa' })));

  expect(getElementsByClassName(root, 'aaa')).toStrictEqual([root.childNodes[0], root.childNodes[0].childNodes[1]]);
});

test('returns the element with given class names', () => {
  const root = f.doc(f.xxx({ class: 'vvv aaa' }, f.yyy(), f.zzz({ class: 'aaa' })));

  expect(getElementsByClassName(root, 'aaa vvv')).toStrictEqual([root.childNodes[0]]);
});
