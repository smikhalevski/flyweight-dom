import { Element, Text } from '../main';
import { uncheckedAppendChild } from '../main/uncheckedAppendChild';

test('appends the first child node to an element', () => {
  const parent = new Element('parent');
  const node = new Text();

  uncheckedAppendChild(parent, node);

  expect(parent['_childNodes']).toBeUndefined();
  expect(parent.firstChild).toBe(node);
  expect(parent.lastChild).toBe(node);
  expect(parent.firstElementChild).toBeNull();
  expect(parent.lastElementChild).toBeNull();

  expect(node.parentNode).toBe(parent);
  expect(node.parentElement).toBe(parent);
  expect(node.previousSibling).toBeNull();
  expect(node.nextSibling).toBeNull();
  expect(node.previousElementSibling).toBeNull();
  expect(node.nextElementSibling).toBeNull();
});

test('appends multiple child nodes to an element', () => {
  const parent = new Element('parent');
  const node1 = new Text();
  const node2 = new Text();
  const node3 = new Text();

  uncheckedAppendChild(parent, node1);
  uncheckedAppendChild(parent, node2);
  uncheckedAppendChild(parent, node3);

  expect(parent['_childNodes']).toBeUndefined();
  expect(parent.firstChild).toBe(node1);
  expect(parent.lastChild).toBe(node3);
  expect(parent.firstElementChild).toBeNull();
  expect(parent.lastElementChild).toBeNull();

  expect(node1.parentNode).toBe(parent);
  expect(node1.parentElement).toBe(parent);
  expect(node1.previousSibling).toBeNull();
  expect(node1.nextSibling).toBe(node2);
  expect(node1.previousElementSibling).toBeNull();
  expect(node1.nextElementSibling).toBeNull();

  expect(node2.parentNode).toBe(parent);
  expect(node2.parentElement).toBe(parent);
  expect(node2.previousSibling).toBe(node1);
  expect(node2.nextSibling).toBe(node3);
  expect(node2.previousElementSibling).toBeNull();
  expect(node2.nextElementSibling).toBeNull();

  expect(node3.parentNode).toBe(parent);
  expect(node3.parentElement).toBe(parent);
  expect(node3.previousSibling).toBe(node2);
  expect(node3.nextSibling).toBeNull();
  expect(node3.previousElementSibling).toBeNull();
  expect(node3.nextElementSibling).toBeNull();
});

test('updates childNodes', () => {
  const parent = new Element('parent');
  const node = new Text();

  expect(parent.childNodes.length).toBe(0);
  expect(parent.children.length).toBe(0);

  uncheckedAppendChild(parent, node);

  expect(parent.childNodes.length).toBe(1);
  expect(parent.childNodes[0]).toBe(node);
  expect(parent.children.length).toBe(0);
});

test('appends the first element to an element', () => {
  const parent = new Element('parent');
  const node = new Element('node');

  uncheckedAppendChild(parent, node);

  expect(parent['_children']).toBeUndefined();
  expect(parent.firstChild).toBe(node);
  expect(parent.lastChild).toBe(node);
  expect(parent.firstElementChild).toBe(node);
  expect(parent.lastElementChild).toBe(node);

  expect(node.parentNode).toBe(parent);
  expect(node.parentElement).toBe(parent);
  expect(node.previousSibling).toBeNull();
  expect(node.nextSibling).toBeNull();
  expect(node.previousElementSibling).toBeNull();
  expect(node.nextElementSibling).toBeNull();
});

test('appends multiple elements to an element', () => {
  const parent = new Element('parent');
  const node1 = new Element('node1');
  const node2 = new Element('node2');
  const node3 = new Element('node3');

  uncheckedAppendChild(parent, node1);
  uncheckedAppendChild(parent, node2);
  uncheckedAppendChild(parent, node3);

  expect(parent['_children']).toBeUndefined();
  expect(parent.firstChild).toBe(node1);
  expect(parent.lastChild).toBe(node3);
  expect(parent.firstElementChild).toBe(node1);
  expect(parent.lastElementChild).toBe(node3);

  expect(node1.parentNode).toBe(parent);
  expect(node1.parentElement).toBe(parent);
  expect(node1.previousSibling).toBeNull();
  expect(node1.nextSibling).toBe(node2);
  expect(node1.previousElementSibling).toBeNull();
  expect(node1.nextElementSibling).toBe(node2);

  expect(node2.parentNode).toBe(parent);
  expect(node2.parentElement).toBe(parent);
  expect(node2.previousSibling).toBe(node1);
  expect(node2.nextSibling).toBe(node3);
  expect(node2.previousElementSibling).toBe(node1);
  expect(node2.nextElementSibling).toBe(node3);

  expect(node3.parentNode).toBe(parent);
  expect(node3.parentElement).toBe(parent);
  expect(node3.previousSibling).toBe(node2);
  expect(node3.nextSibling).toBeNull();
  expect(node3.previousElementSibling).toBe(node2);
  expect(node3.nextElementSibling).toBeNull();
});

test('updates children when an element is appended', () => {
  const parent = new Element('parent');
  const node = new Element('node');

  expect(parent.childNodes.length).toBe(0);
  expect(parent.children.length).toBe(0);

  uncheckedAppendChild(parent, node);

  expect(parent.childNodes.length).toBe(1);
  expect(parent.childNodes[0]).toBe(node);
  expect(parent.children.length).toBe(1);
  expect(parent.children[0]).toBe(node);
});

test('appends mixed nodes to an element', () => {
  const parent = new Element('parent');
  const node1 = new Element('node1');
  const node2 = new Text('node2');
  const node3 = new Element('node3');

  uncheckedAppendChild(parent, node1);
  uncheckedAppendChild(parent, node2);
  uncheckedAppendChild(parent, node3);

  expect(parent['_children']).toBeUndefined();
  expect(parent.firstChild).toBe(node1);
  expect(parent.lastChild).toBe(node3);
  expect(parent.firstElementChild).toBe(node1);
  expect(parent.lastElementChild).toBe(node3);

  expect(node1.parentNode).toBe(parent);
  expect(node1.parentElement).toBe(parent);
  expect(node1.previousSibling).toBeNull();
  expect(node1.nextSibling).toBe(node2);
  expect(node1.previousElementSibling).toBeNull();
  expect(node1.nextElementSibling).toBe(node3);

  expect(node2.parentNode).toBe(parent);
  expect(node2.parentElement).toBe(parent);
  expect(node2.previousSibling).toBe(node1);
  expect(node2.nextSibling).toBe(node3);
  expect(node2.previousElementSibling).toBe(node1);
  expect(node2.nextElementSibling).toBe(node3);

  expect(node3.parentNode).toBe(parent);
  expect(node3.parentElement).toBe(parent);
  expect(node3.previousSibling).toBe(node2);
  expect(node3.nextSibling).toBeNull();
  expect(node3.previousElementSibling).toBe(node1);
  expect(node3.nextElementSibling).toBeNull();
});
