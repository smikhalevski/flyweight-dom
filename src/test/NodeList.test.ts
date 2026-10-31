import { describe, expect, test } from 'vitest';
import { Element, Text } from '../main/index.js';
import { EmptyNodeList, LiveNodeList } from '../main/NodeList.js';
import { isElement } from '../main/utils.js';

describe('LiveNodeList', () => {
  test('returns a node by index', () => {
    const text1 = new Text();
    const text2 = new Text();
    const nodeList = new LiveNodeList(new Element('aaa').append(text1, text2));

    expect(nodeList[0]).toBe(text1);
    expect(nodeList[1]).toBe(text2);
  });

  test('returns undefined if index is out of range', () => {
    const nodeList = new LiveNodeList(new Element('aaa').append(new Text()));

    expect(nodeList[1]).toBeUndefined();
  });

  test('does not treat a key with a leading zero as an index', () => {
    const nodeList = new LiveNodeList(new Element('aaa').append(new Text(), new Text()));

    // @ts-expect-error The key isn't a numeric index
    expect(nodeList['01']).toBeUndefined();
  });

  test('reflects changes of the root', () => {
    const element = new Element('aaa');
    const text = new Text();
    const nodeList = new LiveNodeList(element);

    element.append(text);

    expect(nodeList[0]).toBe(text);
  });

  test('iterates over nodes that pass the filter', () => {
    const element = new Element('bbb');
    const nodeList = new LiveNodeList(new Element('aaa').append(new Text(), element), isElement);

    expect(Array.from(nodeList)).toStrictEqual([element]);
  });

  describe('length', () => {
    test('returns the number of nodes that pass the filter', () => {
      const nodeList = new LiveNodeList(new Element('aaa').append(new Text(), new Element('bbb')), isElement);

      expect(nodeList.length).toBe(1);
    });
  });

  describe('item', () => {
    test('returns a node that passes the filter by index', () => {
      const element = new Element('bbb');
      const nodeList = new LiveNodeList(new Element('aaa').append(new Text(), element), isElement);

      expect(nodeList.item(0)).toBe(element);
    });

    test('returns null if index is out of range', () => {
      expect(new LiveNodeList(new Element('aaa')).item(0)).toBeNull();
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
