import { describe, expect, test } from 'vitest';
import { Element, Node, Text } from '../main/index.js';
import { assertInsertableNode, uncheckedToInsertableNode } from '../main/uncheckedToInsertableNode.js';

describe('assertInsertableNode', () => {
  class MockNode extends Node {
    nodeType;
    nodeName;

    constructor(nodeType = -1, nodeName = '') {
      super();
      this.nodeType = nodeType;
      this.nodeName = nodeName;
    }
  }

  test('throws on DOCUMENT_NODE nodes', () => {
    const node = new MockNode(Node.DOCUMENT_NODE);

    expect(() => assertInsertableNode(new Element('aaa'), node)).toThrow(new Error('Node cannot be a child'));
  });

  test('throws on ATTRIBUTE_NODE nodes', () => {
    const node = new MockNode(Node.ATTRIBUTE_NODE);

    expect(() => assertInsertableNode(new Element('aaa'), node)).toThrow(new Error('Node cannot be a child'));
  });

  test('throws if a child contains a parent', () => {
    const element1 = new Element('element1');
    const element2 = new Element('element2');
    const element3 = new Element('element3');

    element1.append(element2);
    element2.append(element3);

    assertInsertableNode(element1, element3);

    expect(() => assertInsertableNode(element3, element1)).toThrow(
      new Error('The new child element contains the parent')
    );
  });
});

describe('uncheckedToInsertableNode', () => {
  test('converts string to Text instance', () => {
    expect(uncheckedToInsertableNode('aaa')).toEqual(new Text('aaa'));
  });

  test('preserves node instances as is', () => {
    const node = new Element('aaa');

    expect(uncheckedToInsertableNode(node)).toBe(node);
  });
});
