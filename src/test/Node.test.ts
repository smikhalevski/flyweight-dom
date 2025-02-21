import { Element, Node, Text } from '../main';

describe('Node', () => {
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
    expect(node.parentNode).toBe(null);
    expect(node.parentElement).toBe(null);
    expect(node.previousSibling).toBe(null);
    expect(node.nextSibling).toBe(null);
    expect(node.firstChild).toBe(null);
    expect(node.lastChild).toBe(null);
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

  // test('cloneNode throws', () => {
  //   const node = new MockNode();
  //
  //   expect(() => node.cloneNode()).toThrow(new Error('Abstract method'));
  // });
});
