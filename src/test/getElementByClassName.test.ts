import { expect, test } from 'vitest';
import { h } from '../main/dsl.ts';
import { getElementsByClassName } from '../main/getElementsByClassName.ts';
import { Element } from '../main/index.ts';

test('returns elements with the given class name', () => {
  const root = h.document(h('xxx', { class: 'vvv aaa' }, h('yyy'), h('zzz', { class: 'aaa' })));

  expect(getElementsByClassName(root, 'aaa')).toStrictEqual([root.childNodes[0], root.childNodes[0].childNodes[1]]);
});

test('returns elements that have all given class names', () => {
  const root = h.document(h('xxx', { class: 'vvv aaa' }, h('yyy'), h('zzz', { class: 'aaa' })));

  expect(getElementsByClassName(root, 'aaa vvv')).toStrictEqual([root.childNodes[0]]);
});

test('does not create classList on visited elements', () => {
  const root = h.document(h('xxx', { class: 'aaa' }));

  getElementsByClassName(root, 'aaa');

  expect((root.firstChild as Element)['_classList']).toBeUndefined();
});

test('does not match a class name that is part of another class name', () => {
  const root = h.document(h('xxx', { class: 'aaabbb bbbaaa' }));

  expect(getElementsByClassName(root, 'aaa')).toStrictEqual([]);
});

test('returns an empty array if class names are blank', () => {
  expect(getElementsByClassName(h('aaa', h('bbb', { class: 'ccc' })), ' \t')).toStrictEqual([]);
});
