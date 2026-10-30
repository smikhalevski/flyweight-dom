import { expect, test } from 'vitest';
import { CDATASection, CharacterData, Element, Node, Text } from '../main/index.js';

test('creates a new Text instance', () => {
  const node = new Text();

  expect(node).toBeInstanceOf(Node);
  expect(node).toBeInstanceOf(CharacterData);
  expect(node).toBeInstanceOf(Text);
  expect(node.nodeType).toBe(Node.TEXT_NODE);
  expect(node.nodeName).toBe('#text');
  expect(node.length).toBe(0);
  expect(node.data).toBe('');
});

test('creates a new Text instance with data', () => {
  const node = new Text('aaa');

  expect(node.length).toBe(3);
  expect(node.data).toBe('aaa');
});

test('clones a Text instance', () => {
  const node = new Text('aaa').cloneNode() as Text;

  expect(node).toBeInstanceOf(Text);
  expect(node.data).toBe('aaa');
});

test('splits a Text', () => {
  const node1 = new Text('aaabbb');
  const node2 = node1.splitText(3);

  expect(node1.data).toBe('aaa');

  expect(node2).toBeInstanceOf(Text);
  expect(node2.data).toBe('bbb');
});

test('throws if split offset is out of range', () => {
  expect(() => new Text('aaa').splitText(4)).toThrow('The offset 4 is out of range');
});

test('returns whole text of adjacent Text and CDATASection nodes', () => {
  const text = new Text('bbb');

  new Element('aaa').append(new CDATASection('ccc'), text, new Element('ddd'), 'eee');

  expect(text.wholeText).toBe('cccbbb');
});

test('creates a new Text instance with data', () => {
  const node = new Text('aaa');

  expect(node.length).toBe(3);
});
