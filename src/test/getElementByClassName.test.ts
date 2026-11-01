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

test('does not create classList on visited elements', () => {
  const root = f.doc(f.xxx({ class: 'aaa' }));

  getElementsByClassName(root, 'aaa');

  expect(Object.getOwnPropertyDescriptor(root.firstChild, 'classList')).toBeUndefined();
});

test('does not match a class name that is a part of another class name', () => {
  const root = f.doc(f.xxx({ class: 'aaabbb bbbaaa' }));

  expect(getElementsByClassName(root, 'aaa')).toStrictEqual([]);
});

test('returns an empty array if class names are blank', () => {
  expect(getElementsByClassName(f.aaa(f.bbb({ class: 'ccc' })), ' \t')).toStrictEqual([]);
});
