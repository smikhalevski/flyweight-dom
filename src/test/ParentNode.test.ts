import { describe, expect, test } from 'vitest';
import { Document, Element, ParentNode, Text } from '../main/index.js';

test('extends a class constructor', () => {
  class MockNode extends ParentNode() {
    readonly nodeName = '';
    readonly nodeType = -1;

    cloneNode(deep?: boolean): MockNode {
      return this;
    }
  }

  const mockNode = new Element('aaa').appendChild(new MockNode()).append('ccc');

  expect(mockNode.firstChild).toEqual(new Text('ccc'));
});

describe('hasChildNodes', () => {
  test('returns true if has children', () => {
    const parent = new Element('aaa');
    const text = new Text('text');

    expect(parent.hasChildNodes()).toBe(false);

    parent.append(text);

    expect(parent.hasChildNodes()).toBe(true);
  });
});

describe('appendChild', () => {
  test('appends a child to parent', () => {
    const parent = new Element('aaa');
    const text = new Text('text');

    parent.appendChild(text);

    expect(text.parentNode).toBe(parent);
  });

  test('removes a child from its previous parent', () => {
    const parent1 = new Element('parent1');
    const parent2 = new Element('parent2');
    const text = new Text('text');

    parent1.appendChild(text);
    parent2.appendChild(text);

    expect(text.parentNode).toBe(parent2);
    expect(parent1.firstChild).toBeNull();
    expect(parent2.firstChild).toBe(text);
  });
});

describe('insertBefore', () => {
  test('inserts a node as the first child', () => {
    const parent = new Element('aaa');
    const text = new Text('text');

    parent.insertBefore(text, null);

    expect(text.parentNode).toBe(parent);
    expect(parent.firstChild).toBe(text);
    expect(parent.lastChild).toBe(text);
  });

  test('throws if parent does not contain a child', () => {
    const parent = new Element('aaa');
    const text1 = new Text('text1');
    const text2 = new Text('text2');

    expect(() => parent.insertBefore(text2, text1)).toThrow(
      new Error('The node before which the new node is to be inserted is not a child of this node')
    );
  });

  test('inserts a node before the first child', () => {
    const parent = new Element('aaa');
    const text1 = new Text('text1');
    const text2 = new Text('text2');

    parent.appendChild(text1);
    parent.insertBefore(text2, text1);

    expect(text2.parentNode).toBe(parent);
    expect(parent.firstChild).toBe(text2);
    expect(parent.lastChild).toBe(text1);
  });

  test('inserts a node as an interim child', () => {
    const parent = new Element('aaa');
    const text1 = new Text('text1');
    const text2 = new Text('text2');
    const text3 = new Text('text3');

    parent.appendChild(text1);
    parent.appendChild(text3);
    parent.insertBefore(text2, text3);

    expect(text2.parentNode).toBe(parent);
    expect(parent.childNodes[0]).toBe(text1);
    expect(parent.childNodes[1]).toBe(text2);
    expect(parent.childNodes[2]).toBe(text3);
    expect(parent.firstChild).toBe(text1);
    expect(parent.lastChild).toBe(text3);
  });
});

describe('removeChild', () => {
  test('removes a child', () => {
    const parent = new Element('aaa');
    const text = new Text('text');

    parent.appendChild(text);
    parent.removeChild(text);

    expect(text.parentNode).toBeNull();
    expect(parent.firstChild).toBeNull();
  });

  test('throws if parent does not contain a child', () => {
    const parent = new Element('aaa');
    const text = new Text('text');

    expect(() => parent.removeChild(text)).toThrow(new Error('The node to be removed is not a child of this node'));
  });
});

describe('replaceChild', () => {
  test('replaces a child with a node', () => {
    const parent = new Element('aaa');
    const text1 = new Text('text1');
    const text2 = new Text('text2');

    parent.appendChild(text1);
    parent.replaceChild(text2, text1);

    expect(text1.parentNode).toBeNull();
    expect(text2.parentNode).toBe(parent);
  });

  test('throws if parent does not contain a child', () => {
    const parent = new Element('aaa');
    const text1 = new Text('text1');
    const text2 = new Text('text2');

    expect(() => parent.replaceChild(text2, text1)).toThrow(
      new Error('The node to be replaced is not a child of this node')
    );
  });
});

describe('children', () => {
  test('returns the array of child elements', () => {
    const parent = new Element('aaa');
    const child1 = new Text('child1');
    const child2 = new Element('child2');
    const child3 = new Element('child3');

    parent.append(child1, child2, child3);

    expect(parent.children.length).toBe(2);
    expect(parent.children[0]).toBe(child2);
    expect(parent.children[1]).toBe(child3);
  });

  test('returns the same array', () => {
    const element = new Element('aaa');

    expect(element.children).toBe(element.children);
  });
});

describe('childElementCount', () => {
  test('returns the number of child elements', () => {
    const parent = new Element('aaa');
    const child1 = new Text('child1');
    const child2 = new Element('child2');
    const child3 = new Element('child3');

    parent.append(child1, child2, child3);

    expect(parent.children.length).toBe(2);
    expect(parent.children[0]).toBe(child2);
    expect(parent.children[1]).toBe(child3);
  });

  test('returns the same array', () => {
    const element = new Element('aaa');

    expect(element.children).toBe(element.children);
  });
});

describe('firstElementChild', () => {
  test('returns the first child element', () => {
    const parent = new Element('aaa');
    const child1 = new Text('child1');
    const child2 = new Element('child2');
    const child3 = new Element('child3');

    parent.append(child1, child2, child3);

    expect(parent.firstElementChild).toBe(child2);
  });
});

describe('lastElementChild', () => {
  test('returns the last child element', () => {
    const parent = new Element('aaa');
    const child1 = new Text('child1');
    const child2 = new Element('child2');
    const child3 = new Element('child3');

    parent.append(child1, child2, child3);

    expect(parent.lastElementChild).toBe(child3);
  });
});

describe('append', () => {
  test('appends the child', () => {
    const parent = new Element('aaa');
    const child1 = new Text('child1');
    const child2 = new Text('child2');

    expect(parent.append(child1, child2)).toBe(parent);

    expect(parent.firstChild).toBe(child1);
    expect(parent.lastChild).toBe(child2);
    expect(parent.firstChild!.nextSibling).toBe(child2);
  });

  test('does not append nodes if any of them is not appendable', () => {
    const parent = new Element('aaa');
    const child1 = new Text('child1');
    const child2 = new Document();

    expect(() => parent.append(child1, child2)).toThrow(new Error('Node cannot be a child'));
    expect(parent.firstChild).toBeNull();
    expect(child1.parentNode).toBeNull();
    expect(child2.parentNode).toBeNull();
  });
});

describe('prepend', () => {
  test('inserts a node as the first child', () => {
    const parent = new Element('aaa');
    const text = new Text('text');

    expect(parent.prepend(text)).toBe(parent);

    expect(text.parentNode).toBe(parent);
    expect(parent.firstChild).toBe(text);
    expect(parent.lastChild).toBe(text);
  });

  test('inserts a node before the first child', () => {
    const parent = new Element('aaa');
    const text1 = new Text('text1');
    const text2 = new Text('text2');

    parent.appendChild(text1);
    parent.prepend(text2);

    expect(text2.parentNode).toBe(parent);
    expect(parent.firstChild).toBe(text2);
    expect(parent.lastChild).toBe(text1);
  });
});

describe('replaceChildren', () => {
  test('removes all children', () => {
    const parent = new Element('aaa');
    const child = new Element('bbb');

    parent.append(child);

    expect(parent.children.length).toBe(1);
    expect(parent.childNodes.length).toBe(1);

    expect(parent.replaceChildren()).toBe(parent);

    expect(child.parentNode).toBeNull();
    expect(parent.firstChild).toBeNull();
    expect(parent.lastChild).toBeNull();
    expect(parent.children.length).toBe(0);
    expect(parent.childNodes.length).toBe(0);
  });

  test('appends new child nodes', () => {
    const parent = new Element('aaa');
    const child1 = new Element('bbb');
    const child2 = new Element('ccc');

    parent.append(child1);
    parent.replaceChildren(child2);

    expect(child1.parentNode).toBeNull();
    expect(child2.parentNode).toBe(parent);
    expect(parent.firstChild).toBe(child2);
    expect(parent.lastChild).toBe(child2);
    expect(parent.children.length).toBe(1);
    expect(parent.childNodes.length).toBe(1);
  });
});
