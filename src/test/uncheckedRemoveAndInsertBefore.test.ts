import { expect, test } from 'vitest';
import { DocumentFragment, Element, Text } from '../main/index.js';
import { uncheckedRemoveAndInsertBefore } from '../main/uncheckedRemoveAndInsertBefore.js';
import { uncheckedAppendChild } from '../main/uncheckedAppendChild.js';

test('appends the first child node to an element', () => {
  const parent = new Element('parent');
  const node1 = new Text('node1');
  const node2 = new Text('node2');

  uncheckedAppendChild(parent, node2);
  uncheckedRemoveAndInsertBefore(parent, node1, node2);

  expect(parent['_childNodes']).toBeUndefined();
  expect(parent.firstChild).toBe(node1);
  expect(parent.lastChild).toBe(node2);

  expect(node1.parentNode).toBe(parent);
  expect(node1.previousSibling).toBeNull();
  expect(node1.nextSibling).toBe(node2);

  expect(node2.parentNode).toBe(parent);
  expect(node2.previousSibling).toBe(node1);
  expect(node2.nextSibling).toBeNull();
});

test('removes a node from its parent', () => {
  const parent1 = new Element('parent1');
  const parent2 = new Element('parent2');
  const node1 = new Text();
  const node2 = new Text();

  parent1.childNodes;

  uncheckedAppendChild(parent1, node1);
  uncheckedAppendChild(parent2, node2);
  uncheckedRemoveAndInsertBefore(parent2, node1, node2);

  expect(parent1.childNodes.length).toBe(0);
  expect(parent1.firstChild).toBeNull();
  expect(parent1.lastChild).toBeNull();

  expect(parent2.childNodes[0]).toBe(node1);
  expect(parent2.childNodes[1]).toBe(node2);
  expect(parent2.firstChild).toBe(node1);
  expect(parent2.lastChild).toBe(node2);
});

test('moves all children from a fragment to another parent', () => {
  const parent1 = new DocumentFragment();
  const parent2 = new Element('parent2');
  const node1 = new Text('node1');
  const node2 = new Text('node2');

  parent1.childNodes;

  uncheckedAppendChild(parent1, node1);
  uncheckedAppendChild(parent2, node2);
  uncheckedRemoveAndInsertBefore(parent2, parent1, node2);

  expect(parent1.childNodes.length).toBe(0);
  expect(parent1.firstChild).toBeNull();
  expect(parent1.lastChild).toBeNull();

  expect(node1.parentNode).toBe(parent2);
  expect(node1.previousSibling).toBeNull();
  expect(node1.nextSibling).toBe(node2);

  expect(node2.parentNode).toBe(parent2);
  expect(node2.previousSibling).toBe(node1);
  expect(node2.nextSibling).toBeNull();
});
