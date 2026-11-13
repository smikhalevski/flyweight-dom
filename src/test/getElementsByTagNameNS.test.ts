import { expect, test } from 'vitest';
import { getElementsByTagNameNS } from '../main/getElementsByTagNameNS.ts';
import { Element } from '../main/index.ts';

function makeTestRoot() {
  const root = new Element('aaa');

  root.append(new Element('xxx:bbb', {}, 'urn:111'), new Element('bbb', {}, 'urn:222'), new Element('xxx:bbb'));

  return root;
}

test('returns elements with the given namespace and local name', () => {
  const root = makeTestRoot();

  expect(getElementsByTagNameNS(root, 'urn:111', 'bbb')).toStrictEqual([root.childNodes[0]]);
});

test('returns elements with any namespace if the namespace is *', () => {
  const root = makeTestRoot();

  expect(getElementsByTagNameNS(root, '*', 'bbb')).toStrictEqual([root.childNodes[0], root.childNodes[1]]);
});

test('returns all elements of the namespace if the local name is *', () => {
  const root = makeTestRoot();

  expect(getElementsByTagNameNS(root, 'urn:222', '*')).toStrictEqual([root.childNodes[1]]);
});

test('a prefix is a part of the local name of an element without a namespace', () => {
  const root = makeTestRoot();

  expect(getElementsByTagNameNS(root, null, 'xxx:bbb')).toStrictEqual([root.childNodes[2]]);
});
