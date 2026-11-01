import { describe, expect, test } from 'vitest';
import { DocumentFragment, Element, Text } from '../main/index.js';
import { EmptyNodeList, ChildNodeList } from '../main/NodeList.js';
import { isElement } from '../main/utils.js';

describe('ChildNodeList', () => {
  test('returns a node by index', () => {
    const text1 = new Text();
    const text2 = new Text();
    const nodeList = new ChildNodeList(new Element('aaa').append(text1, text2));

    expect(nodeList[0]).toBe(text1);
    expect(nodeList[1]).toBe(text2);
  });

  test('returns undefined if index is out of range', () => {
    const nodeList = new ChildNodeList(new Element('aaa').append(new Text()));

    expect(nodeList[1]).toBeUndefined();
  });

  test('does not treat a key with a leading zero as an index', () => {
    const nodeList = new ChildNodeList(new Element('aaa').append(new Text(), new Text()));

    // @ts-expect-error The key isn't a numeric index
    expect(nodeList['01']).toBeUndefined();
  });

  test('reflects changes of the root', () => {
    const element = new Element('aaa');
    const text = new Text();
    const nodeList = new ChildNodeList(element);

    element.append(text);

    expect(nodeList[0]).toBe(text);
  });

  test('returns nodes that pass the filter by decreasing index', () => {
    const element1 = new Element('bbb');
    const element2 = new Element('ccc');
    const element3 = new Element('ddd');
    const nodeList = new ChildNodeList(
      new Element('aaa').append(element1, new Text(), element2, new Text(), element3),
      isElement
    );

    expect(nodeList[2]).toBe(element3);
    expect(nodeList[1]).toBe(element2);
    expect(nodeList[0]).toBe(element1);
  });

  test('reflects an appended child after a read', () => {
    const element = new Element('aaa').append(new Text());
    const nodeList = new ChildNodeList(element);

    expect(nodeList.length).toBe(1);

    element.append(new Text());

    expect(nodeList.length).toBe(2);
  });

  test('reflects an inserted child after a read', () => {
    const text1 = new Text();
    const text2 = new Text();
    const element = new Element('aaa').append(text1);
    const nodeList = new ChildNodeList(element);

    expect(nodeList[0]).toBe(text1);

    element.insertBefore(text2, text1);

    expect(nodeList[0]).toBe(text2);
  });

  test('reflects a removed child after a read', () => {
    const text1 = new Text();
    const text2 = new Text();
    const element = new Element('aaa').append(text1, text2);
    const nodeList = new ChildNodeList(element);

    expect(nodeList[0]).toBe(text1);

    text1.remove();

    expect(nodeList[0]).toBe(text2);
  });

  test('reflects replaced children after a read', () => {
    const element = new Element('aaa').append(new Text());
    const nodeList = new ChildNodeList(element);

    expect(nodeList.length).toBe(1);

    element.replaceChildren();

    expect(nodeList.length).toBe(0);
  });

  test('reflects a fragment that was appended elsewhere after a read', () => {
    const fragment = new DocumentFragment().append(new Text());
    const nodeList = new ChildNodeList(fragment);

    expect(nodeList.length).toBe(1);

    new Element('aaa').append(fragment);

    expect(nodeList.length).toBe(0);
  });

  test('reflects a fragment that was inserted elsewhere after a read', () => {
    const fragment = new DocumentFragment().append(new Text());
    const nodeList = new ChildNodeList(fragment);

    expect(nodeList.length).toBe(1);

    const text = new Text();
    new Element('aaa').append(text).insertBefore(fragment, text);

    expect(nodeList.length).toBe(0);
  });

  test('reports an index as present if it is in range', () => {
    const nodeList = new ChildNodeList(new Element('aaa').append(new Text()));

    expect(0 in nodeList).toBe(true);
    expect(1 in nodeList).toBe(false);
  });

  test('reports keys of the list as present', () => {
    expect('item' in new ChildNodeList(new Element('aaa'))).toBe(true);
  });

  test('iterates over nodes that pass the filter', () => {
    const element = new Element('bbb');
    const nodeList = new ChildNodeList(new Element('aaa').append(new Text(), element), isElement);

    expect(Array.from(nodeList)).toStrictEqual([element]);
  });

  test('iterates by index if nodes are removed during iteration', () => {
    const element1 = new Element('aaa');
    const element2 = new Element('bbb');
    const element3 = new Element('ccc');
    const nodeList = new ChildNodeList(new Element('ddd').append(element1, new Text(), element2, element3), isElement);
    const nodes = [];

    for (const node of nodeList) {
      nodes.push(node);
      node.remove();
    }

    expect(nodes).toStrictEqual([element1, element3]);
  });

  describe('length', () => {
    test('returns the number of nodes that pass the filter', () => {
      const nodeList = new ChildNodeList(new Element('aaa').append(new Text(), new Element('bbb')), isElement);

      expect(nodeList.length).toBe(1);
    });
  });

  describe('item', () => {
    test('returns a node that passes the filter by index', () => {
      const element = new Element('bbb');
      const nodeList = new ChildNodeList(new Element('aaa').append(new Text(), element), isElement);

      expect(nodeList.item(0)).toBe(element);
    });

    test('returns null if index is out of range', () => {
      expect(new ChildNodeList(new Element('aaa')).item(0)).toBeNull();
    });

    test('returns null if index is not an integer', () => {
      expect(new ChildNodeList(new Element('aaa').append(new Text(), new Text())).item(0.5)).toBeNull();
    });
  });
});

describe('EmptyNodeList', () => {
  test('has no nodes', () => {
    const nodeList = new EmptyNodeList();

    expect(nodeList.length).toBe(0);
    expect(nodeList.item(0)).toBeNull();
    expect(nodeList[0]).toBeUndefined();
    expect(Array.from(nodeList)).toStrictEqual([]);
  });
});
