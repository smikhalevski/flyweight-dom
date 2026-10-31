import { expect, test } from 'vitest';
import { ChildNode, Element, Node, ParentNode, Text } from '../main/index.js';
import { NodeList } from '../main/NodeList.js';

class MockNode extends Node {
  readonly nodeName = '';
  readonly nodeType = -1;
}

class MockParentNode extends ParentNode(ChildNode()) {
  readonly nodeName = '';
  readonly nodeType = -1;
}

test('inherits statics from Node', () => {
  expect(Node.ELEMENT_NODE).toBe(1);
});

test('creates a new MockNode instance', () => {
  const node = new MockNode();

  expect(node).toBeInstanceOf(Node);
  expect(node.childNodes).toEqual(new NodeList(node));
  expect(node.parentNode).toBeNull();
  expect(node.parentElement).toBeNull();
  expect(node.previousSibling).toBeNull();
  expect(node.nextSibling).toBeNull();
  expect(node.firstChild).toBeNull();
  expect(node.lastChild).toBeNull();
  expect(node.nodeType).toBe(-1);
  expect(node.nodeName).toBe('');
});

test('populates childNodes', () => {
  const node = new MockNode();

  expect(node.childNodes).toEqual(new NodeList(node));
});

test('hasChildNodes return false', () => {
  const node = new MockNode();

  expect(node.hasChildNodes()).toBe(false);
});

test('child mutation methods throw', () => {
  const node = new MockNode();

  const text = new Text();

  expect(() => node.appendChild(text)).toThrow('This node type does not support this method');
  expect(() => node.insertBefore(text, null)).toThrow('This node type does not support this method');
  expect(() => node.removeChild(text)).toThrow('This node type does not support this method');
  expect(() => node.replaceChild(text, text)).toThrow('This node type does not support this method');
});

test('cloneNode throws', () => {
  expect(() => new MockNode().cloneNode()).toThrow('This node type does not support this method');
});

test('can be appended to an element', () => {
  const node = new MockNode();
  const element = new Element('aaa');

  expect(element.appendChild(node)).toBe(node);
  expect(element.firstChild).toBe(node);
});

test('parentElement is null if parent is not an element', () => {
  const node = new Text();

  new Element('aaa').appendChild(new MockParentNode()).appendChild(node);

  expect(node.parentElement).toBeNull();
});
