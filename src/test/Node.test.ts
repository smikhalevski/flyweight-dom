import { Element, Node, Text } from '../main';

class MockNode extends Node {
  readonly nodeName = '';
  readonly nodeType = -1;
}

test('inherits statics from Node', () => {
  expect(Node.ELEMENT_NODE).toBe(1);
});

test('creates a new MockNode instance', () => {
  const node = new MockNode();

  expect(node).toBeInstanceOf(Node);
  expect(node.childNodes).toEqual([]);
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

  expect(node.childNodes).toEqual([]);
});

test('hasChildNodes return false', () => {
  const node = new MockNode();

  expect(node.hasChildNodes()).toBe(false);
});

test('child mutation methods throw', () => {
  const node = new MockNode();

  const text = new Text();

  expect(() => node.appendChild(text)).toThrow(new Error('This node type does not support this method'));
  expect(() => node.insertBefore(text, null)).toThrow(new Error('This node type does not support this method'));
  expect(() => node.removeChild(text)).toThrow(new Error('This node type does not support this method'));
  expect(() => node.replaceChild(text, text)).toThrow(new Error('This node type does not support this method'));
});

test('cloneNode throws', () => {
  const node = new MockNode();
  const element = new Element('aaa');

  expect(element.appendChild(node)).toBe(node);
  expect(element.firstChild).toBe(node);
});
