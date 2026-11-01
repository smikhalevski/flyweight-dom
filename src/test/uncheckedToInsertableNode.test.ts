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

  test('throws if the node is a document', () => {
    const node = new MockNode(Node.DOCUMENT_NODE);

    expect(() => assertInsertableNode(new Element('aaa'), node)).toThrow('Node cannot be a child');
  });

  test('throws if the node is an attribute', () => {
    const node = new MockNode(Node.ATTRIBUTE_NODE);

    expect(() => assertInsertableNode(new Element('aaa'), node)).toThrow('Node cannot be a child');
  });

  test('throws if the node contains the parent', () => {
    const element1 = new Element('element1');
    const element2 = new Element('element2');
    const element3 = new Element('element3');

    element1.append(element2);
    element2.append(element3);

    assertInsertableNode(element1, element3);

    expect(() => assertInsertableNode(element3, element1)).toThrow('The new child element contains the parent');
  });
});

describe('uncheckedToInsertableNode', () => {
  test('converts a string to a text node', () => {
    expect(uncheckedToInsertableNode('aaa')).toEqual(new Text('aaa'));
  });

  test('returns a node as is', () => {
    const node = new Element('aaa');

    expect(uncheckedToInsertableNode(node)).toBe(node);
  });
});
