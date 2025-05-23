import { expect, test } from 'vitest';
import { Element, Text } from '../main/index.js';
import { uncheckedAppendChild } from '../main/uncheckedAppendChild.js';
import { uncheckedRemoveChild } from '../main/uncheckedRemoveChild.js';

test('removes the only child', () => {
  const parent = new Element('parent');
  const node = new Text('node');

  uncheckedAppendChild(parent, node);
  uncheckedRemoveChild(parent, node);

  expect(parent['_childNodes']).toBeUndefined();
  expect(parent.firstChild).toBeNull();
  expect(parent.lastChild).toBeNull();
  expect(parent.firstElementChild).toBeNull();
  expect(parent.lastElementChild).toBeNull();

  expect(node.parentNode).toBeNull();
  expect(node.parentElement).toBeNull();
  expect(node.previousSibling).toBeNull();
  expect(node.nextSibling).toBeNull();
  expect(node.previousElementSibling).toBeNull();
  expect(node.nextElementSibling).toBeNull();
});

test('removes the middle child', () => {
  const parent = new Element('parent');
  const node1 = new Text('node1');
  const node2 = new Text('node2');
  const node3 = new Text('node3');

  uncheckedAppendChild(parent, node1);
  uncheckedAppendChild(parent, node2);
  uncheckedAppendChild(parent, node3);
  uncheckedRemoveChild(parent, node2);

  expect(parent['_childNodes']).toBeUndefined();
  expect(parent.firstChild).toBe(node1);
  expect(parent.lastChild).toBe(node3);
  expect(parent.firstElementChild).toBeNull();
  expect(parent.lastElementChild).toBeNull();

  expect(node1.parentNode).toBe(parent);
  expect(node1.parentElement).toBe(parent);
  expect(node1.previousSibling).toBeNull();
  expect(node1.nextSibling).toBe(node3);
  expect(node1.previousElementSibling).toBeNull();
  expect(node1.nextElementSibling).toBeNull();

  expect(node2.parentNode).toBeNull();
  expect(node2.parentElement).toBeNull();
  expect(node2.previousSibling).toBeNull();
  expect(node2.nextSibling).toBeNull();
  expect(node2.previousElementSibling).toBeNull();
  expect(node2.nextElementSibling).toBeNull();

  expect(node3.parentNode).toBe(parent);
  expect(node3.parentElement).toBe(parent);
  expect(node3.previousSibling).toBe(node1);
  expect(node3.nextSibling).toBeNull();
  expect(node3.previousElementSibling).toBeNull();
  expect(node3.nextElementSibling).toBeNull();
});

test('updates childNodes', () => {
  const parent = new Element('parent');
  const node1 = new Text('node1');
  const node2 = new Text('node2');
  const node3 = new Text('node3');

  expect(parent.childNodes.length).toBe(0);
  expect(parent.children.length).toBe(0);

  uncheckedAppendChild(parent, node1);
  uncheckedAppendChild(parent, node2);
  uncheckedAppendChild(parent, node3);
  uncheckedRemoveChild(parent, node2);

  expect(parent.childNodes.length).toBe(2);
  expect(parent.childNodes[0]).toBe(node1);
  expect(parent.childNodes[1]).toBe(node3);

  expect(parent.children.length).toBe(0);
});

test('removes the only element', () => {
  const parent = new Element('parent');
  const node = new Element('node');

  uncheckedAppendChild(parent, node);
  uncheckedRemoveChild(parent, node);

  expect(parent['_childNodes']).toBeUndefined();
  expect(parent.firstChild).toBeNull();
  expect(parent.lastChild).toBeNull();
  expect(parent.firstElementChild).toBeNull();
  expect(parent.lastElementChild).toBeNull();

  expect(node.parentNode).toBeNull();
  expect(node.parentElement).toBeNull();
  expect(node.previousSibling).toBeNull();
  expect(node.nextSibling).toBeNull();
  expect(node.previousElementSibling).toBeNull();
  expect(node.nextElementSibling).toBeNull();
});

test('removes the middle element', () => {
  const parent = new Element('parent');
  const node1 = new Element('node1');
  const node2 = new Element('node2');
  const node3 = new Element('node3');

  uncheckedAppendChild(parent, node1);
  uncheckedAppendChild(parent, node2);
  uncheckedAppendChild(parent, node3);
  uncheckedRemoveChild(parent, node2);

  expect(parent['_childNodes']).toBeUndefined();
  expect(parent.firstChild).toBe(node1);
  expect(parent.lastChild).toBe(node3);
  expect(parent.firstElementChild).toBe(node1);
  expect(parent.lastElementChild).toBe(node3);

  expect(node1.parentNode).toBe(parent);
  expect(node1.parentElement).toBe(parent);
  expect(node1.previousSibling).toBeNull();
  expect(node1.nextSibling).toBe(node3);
  expect(node1.previousElementSibling).toBeNull();
  expect(node1.nextElementSibling).toBe(node3);

  expect(node2.parentNode).toBeNull();
  expect(node2.parentElement).toBeNull();
  expect(node2.previousSibling).toBeNull();
  expect(node2.nextSibling).toBeNull();
  expect(node2.previousElementSibling).toBeNull();
  expect(node2.nextElementSibling).toBeNull();

  expect(node3.parentNode).toBe(parent);
  expect(node3.parentElement).toBe(parent);
  expect(node3.previousSibling).toBe(node1);
  expect(node3.nextSibling).toBeNull();
  expect(node3.previousElementSibling).toBe(node1);
  expect(node3.nextElementSibling).toBeNull();
});

test('updates children', () => {
  const parent = new Element('parent');
  const node1 = new Element('node1');
  const node2 = new Element('node2');
  const node3 = new Element('node3');

  expect(parent.childNodes.length).toBe(0);
  expect(parent.children.length).toBe(0);

  uncheckedAppendChild(parent, node1);
  uncheckedAppendChild(parent, node2);
  uncheckedAppendChild(parent, node3);
  uncheckedRemoveChild(parent, node2);

  expect(parent.childNodes.length).toBe(2);
  expect(parent.childNodes[0]).toBe(node1);
  expect(parent.childNodes[1]).toBe(node3);

  expect(parent.children.length).toBe(2);
  expect(parent.children[0]).toBe(node1);
  expect(parent.children[1]).toBe(node3);
});
