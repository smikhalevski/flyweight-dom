import { expect, test } from 'vitest';
import { DocumentFragment, Element, Text } from '../main/index.js';
import { uncheckedRemoveAndAppendChild } from '../main/uncheckedRemoveAndAppendChild.js';
import { uncheckedAppendChild } from '../main/uncheckedAppendChild.js';

test('appends the first child node to an element', () => {
  const parent = new Element('parent');
  const node = new Text();

  uncheckedRemoveAndAppendChild(parent, node);

  expect(parent.firstChild).toBe(node);
  expect(parent.lastChild).toBe(node);

  expect(node.parentNode).toBe(parent);
  expect(node.previousSibling).toBeNull();
  expect(node.nextSibling).toBeNull();
});

test('appends multiple child nodes to an element', () => {
  const parent = new Element('parent');
  const node1 = new Text();
  const node2 = new Text();
  const node3 = new Text();

  uncheckedRemoveAndAppendChild(parent, node1);
  uncheckedRemoveAndAppendChild(parent, node2);
  uncheckedRemoveAndAppendChild(parent, node3);

  expect(parent.firstChild).toBe(node1);
  expect(parent.lastChild).toBe(node3);

  expect(node1.parentNode).toBe(parent);
  expect(node1.previousSibling).toBeNull();
  expect(node1.nextSibling).toBe(node2);

  expect(node2.parentNode).toBe(parent);
  expect(node2.previousSibling).toBe(node1);
  expect(node2.nextSibling).toBe(node3);

  expect(node3.parentNode).toBe(parent);
  expect(node3.previousSibling).toBe(node2);
  expect(node3.nextSibling).toBeNull();
});

test('removes a node from its parent', () => {
  const parent1 = new Element('parent1');
  const parent2 = new Element('parent2');
  const node = new Text();

  parent1.childNodes;

  uncheckedAppendChild(parent1, node);
  uncheckedRemoveAndAppendChild(parent2, node);

  expect(parent1.childNodes.length).toBe(0);
  expect(parent1.firstChild).toBeNull();
  expect(parent1.lastChild).toBeNull();

  expect(parent2.childNodes[0]).toBe(node);
  expect(parent2.firstChild).toBe(node);
  expect(parent2.lastChild).toBe(node);
});

test('moves all children from a fragment to another parent', () => {
  const parent1 = new DocumentFragment();
  const parent2 = new Element('parent2');
  const node1 = new Text();
  const node2 = new Text();

  parent1.childNodes;

  uncheckedAppendChild(parent1, node1);
  uncheckedAppendChild(parent1, node2);
  uncheckedRemoveAndAppendChild(parent2, parent1);

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
