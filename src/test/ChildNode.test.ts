import { ChildNode, Element, Node, Text } from '../main';

test('extends a class constructor', () => {
  interface MockNode extends ChildNode {}

  class MockNode extends Node {
    readonly nodeName = '';
    readonly nodeType = -1;

    cloneNode(deep?: boolean): MockNode {
      return this;
    }
  }

  ChildNode.extend(MockNode);

  const mockNode = new Element('aaa').appendChild(new MockNode()).after('ccc');

  expect(mockNode.nextSibling).toEqual(new Text('ccc'));
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

    expect(() => element3.after(element1)).toThrow(new Error('The new child element contains the parent'));
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

    expect(() => element3.before(element1)).toThrow(new Error('The new child element contains the parent'));
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
});
