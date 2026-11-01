import { expect, test } from 'vitest';
import { CDATASection, CharacterData, Element, Node, Text } from '../main/index.js';
import { getChildNodes } from './utils.js';

test('creates an empty text node', () => {
  const node = new Text();

  expect(node).toBeInstanceOf(Node);
  expect(node).toBeInstanceOf(CharacterData);
  expect(node).toBeInstanceOf(Text);
  expect(node.nodeType).toBe(Node.TEXT_NODE);
  expect(node.nodeName).toBe('#text');
  expect(node.length).toBe(0);
  expect(node.data).toBe('');
});

test('creates a text node with data', () => {
  const node = new Text('aaa');

  expect(node.length).toBe(3);
  expect(node.data).toBe('aaa');
});

test('clones a text node', () => {
  const node = new Text('aaa').cloneNode() as Text;

  expect(node).toBeInstanceOf(Text);
  expect(node.data).toBe('aaa');
});

test('splits a text node that has no parent', () => {
  const node1 = new Text('aaabbb');
  const node2 = node1.splitText(3);

  expect(node1.data).toBe('aaa');

  expect(node2).toBeInstanceOf(Text);
  expect(node2.data).toBe('bbb');
});

test('inserts the split part before the next sibling', () => {
  const text1 = new Text('aaabbb');
  const text2 = new Text('ccc');
  const parent = new Element('aaa').append(text1, text2);

  const node = text1.splitText(3);

  expect(getChildNodes(parent)).toStrictEqual([text1, node, text2]);
});

test('appends the split part if the text is the last child', () => {
  const text = new Text('aaabbb');
  const parent = new Element('aaa').append(text);

  const node = text.splitText(3);

  expect(getChildNodes(parent)).toStrictEqual([text, node]);
});

test('wholeText joins adjacent text nodes and CDATA sections up to the nearest other node', () => {
  const text = new Text('bbb');

  new Element('aaa').append(new CDATASection('ccc'), text, new Element('ddd'), 'eee');

  expect(text.wholeText).toBe('cccbbb');
});
