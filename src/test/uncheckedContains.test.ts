import { expect, test } from 'vitest';
import { Element, Text } from '../main/index.js';
import { uncheckedAppendChild } from '../main/uncheckedAppendChild.js';
import { uncheckedContains } from '../main/uncheckedContains.js';

test('a node contains itself', () => {
  const node = new Element('node');

  expect(uncheckedContains(node, node)).toBe(true);
});

test('an element contains its child', () => {
  const parent = new Element('parent');
  const node = new Text('node');

  uncheckedAppendChild(parent, node);

  expect(uncheckedContains(parent, node)).toBe(true);
});

test('an element does not contain a child of another parent', () => {
  const parent1 = new Element('parent1');
  const parent2 = new Element('parent2');
  const node1 = new Text('node1');
  const node2 = new Text('node2');

  uncheckedAppendChild(parent1, node1);
  uncheckedAppendChild(parent2, node2);

  expect(uncheckedContains(parent1, node2)).toBe(false);
});

test('an element contains a nested descendant', () => {
  const parent1 = new Element('parent1');
  const parent2 = new Element('parent2');
  const node = new Text('node');

  uncheckedAppendChild(parent1, parent2);
  uncheckedAppendChild(parent2, node);

  expect(uncheckedContains(parent1, node)).toBe(true);
});

test('a child does not contain its parent', () => {
  const parent = new Element('parent');
  const node = new Text('node');

  uncheckedAppendChild(parent, node);

  expect(uncheckedContains(node, parent)).toBe(false);
});
