import { describe, expect, test } from 'vitest';
import { ChildNode, DocumentFragment, Element, Node, Text } from '../main/index.js';
import { getChildNodes } from './utils.js';

test('returns the cached constructor', () => {
  expect(ChildNode()).toBe(ChildNode());
  expect(ChildNode(Node)).toBe(ChildNode());
});

test('cloneNode throws if the base class does not support it', () => {
  expect(() => new (ChildNode())().cloneNode()).toThrow('This node type does not support this method');
});

test('extends a class constructor', () => {
  class MockNode extends ChildNode() {
    readonly nodeName = '';
    readonly nodeType = -1;

    cloneNode(deep?: boolean): MockNode {
      return this;
    }
  }

  const mockNode = new Element('aaa').appendChild(new MockNode()).after('ccc');

  expect(mockNode.nextSibling).toEqual(new Text('ccc'));

  expect(new MockNode() instanceof ChildNode()).toBe(true);
});

describe('after', () => {
  test('does nothing if there is no parent', () => {
    const text1 = new Text('text1');
    const text2 = new Text('text2');

    expect(text1.after(text2)).toBe(text1);
    expect(text2.parentNode).toBeNull();
  });

  test('does not append a parent node to its child', () => {
    const element1 = new Element('element1');
    const element2 = new Element('element2');
    const element3 = new Element('element3');

    element1.append(element2);
    element2.append(element3);

    expect(() => element3.after(element1)).toThrow('The new child element contains the parent');
  });

  test('appends a node as the last child', () => {
    const parent = new Element('parent');
    const text1 = new Text('text1');
    const text2 = new Text('text2');

    parent.append(text1);
    text1.after(text2);

    expect(parent.childNodes[0]).toBe(text1);
    expect(parent.childNodes[1]).toBe(text2);
    expect(text2.parentNode).toBe(parent);
  });

  test('appends a node as an interim child', () => {
    const parent = new Element('parent');
    const text1 = new Text('text1');
    const text2 = new Text('text2');
    const text3 = new Text('text3');

    parent.append(text1, text3);
    text1.after(text2);

    expect(parent.childNodes[0]).toBe(text1);
    expect(parent.childNodes[1]).toBe(text2);
    expect(parent.childNodes[2]).toBe(text3);
    expect(text2.parentNode).toBe(parent);
  });

  test('inserts the next sibling after the node', () => {
    const parent = new Element('parent');
    const text1 = new Text('text1');
    const text2 = new Text('text2');
    const text3 = new Text('text3');

    parent.append(text1, text2, text3);
    text1.after(text2);

    expect(getChildNodes(parent)).toEqual([text1, text2, text3]);
  });

  test('inserts nodes before the first following sibling that is not inserted', () => {
    const parent = new Element('parent');
    const text1 = new Text('text1');
    const text2 = new Text('text2');
    const text3 = new Text('text3');
    const text4 = new Text('text4');

    parent.append(text1, text2, text3);
    text1.after(text2, text4);

    expect(getChildNodes(parent)).toEqual([text1, text2, text4, text3]);
  });

  test('inserts nodes after an empty fragment', () => {
    const text1 = new Text('aaa');
    const text2 = new Text('bbb');
    const text3 = new Text('ccc');
    const parent = new Element('aaa').append(text1, text2);

    text1.after(new DocumentFragment(), text3);

    expect(getChildNodes(parent)).toStrictEqual([text1, text3, text2]);
  });
});

describe('before', () => {
  test('does nothing if there is no parent', () => {
    const text1 = new Text('text1');
    const text2 = new Text('text2');

    expect(text1.before(text2)).toBe(text1);
    expect(text2.parentNode).toBeNull();
  });

  test('does not append a parent node to its child', () => {
    const element1 = new Element('element1');
    const element2 = new Element('element2');
    const element3 = new Element('element3');

    element1.append(element2);
    element2.append(element3);

    expect(() => element3.before(element1)).toThrow('The new child element contains the parent');
  });

  test('inserts a node as the first child', () => {
    const parent = new Element('parent');
    const text1 = new Text('text1');
    const text2 = new Text('text2');

    parent.append(text1);
    text1.before(text2);

    expect(parent.childNodes[0]).toBe(text2);
    expect(parent.childNodes[1]).toBe(text1);
    expect(text2.parentNode).toBe(parent);
  });

  test('inserts a node as an interim child', () => {
    const parent = new Element('parent');
    const text1 = new Text('text1');
    const text2 = new Text('text2');
    const text3 = new Text('text3');

    parent.append(text1, text3);
    text3.before(text2);

    expect(parent.childNodes[0]).toBe(text1);
    expect(parent.childNodes[1]).toBe(text2);
    expect(parent.childNodes[2]).toBe(text3);
    expect(text2.parentNode).toBe(parent);
  });

  test('inserts a node before itself', () => {
    const parent = new Element('parent');
    const text1 = new Text('text1');
    const text2 = new Text('text2');
    const text3 = new Text('text3');

    parent.append(text1, text2, text3);
    text2.before(text2);

    expect(getChildNodes(parent)).toEqual([text1, text2, text3]);
  });

  test('inserts nodes after the first preceding sibling that is not inserted', () => {
    const text1 = new Text('aaa');
    const text2 = new Text('bbb');
    const text3 = new Text('ccc');
    const text4 = new Text('ddd');
    const parent = new Element('aaa').append(text1, text2, text3);

    text3.before(text4, text2);

    expect(getChildNodes(parent)).toStrictEqual([text1, text4, text2, text3]);
  });
});

describe('remove', () => {
  test('does nothing if there is no parent', () => {
    const text = new Text('text');

    expect(text.remove()).toBe(text);
    expect(text.parentNode).toBeNull();
  });

  test('removes a child from parent', () => {
    const parent = new Element('parent');
    const text = new Text('text');

    parent.append(text);

    expect(text.remove()).toBe(text);
    expect(text.parentNode).toBeNull();
  });
});

describe('replaceWith', () => {
  test('does nothing if there is no parent', () => {
    const text1 = new Text('text1');
    const text2 = new Text('text2');

    expect(text1.replaceWith(text2)).toBe(text1);
    expect(text2.parentNode).toBeNull();
  });

  test('replaces a child with another child', () => {
    const parent = new Element('parent');
    const text1 = new Text('text1');
    const text2 = new Text('text2');

    parent.append(text1);
    text1.replaceWith(text2);

    expect(text1.parentNode).toBeNull();
    expect(text2.parentNode).toBe(parent);
    expect(parent.firstChild).toBe(text2);
    expect(parent.lastChild).toBe(text2);
  });

  test('replaces a node with itself', () => {
    const parent = new Element('parent');
    const text1 = new Text('text1');
    const text2 = new Text('text2');
    const text3 = new Text('text3');

    parent.append(text1, text2, text3);
    text2.replaceWith(text2);

    expect(getChildNodes(parent)).toEqual([text1, text2, text3]);
  });
});
