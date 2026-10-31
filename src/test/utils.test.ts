import { describe, expect, test } from 'vitest';
import {
  CDATASection,
  Comment,
  Document,
  DocumentFragment,
  DocumentType,
  Element,
  Node,
  ProcessingInstruction,
  Text,
} from '../main/index.js';
import { defineNodeType } from '../main/utils.js';

describe('defineNodeType', () => {
  test('defines nodeType and nodeName on the prototype', () => {
    class MockNode extends Node {}

    defineNodeType(MockNode, 111, 'aaa');

    const node = new MockNode();

    expect(node.nodeType).toBe(111);
    expect(node.nodeName).toBe('aaa');
    expect(Object.keys(node)).not.toContain('nodeName');
  });

  test('defines a nodeName getter', () => {
    class MockNode extends Node {
      name = 'aaa';
    }

    defineNodeType(MockNode, 111, node => node.name);

    const node = new MockNode();
    node.name = 'bbb';

    expect(node.nodeName).toBe('bbb');
  });

  test('allows assigning nodeName if it is derived', () => {
    class MockNode extends Node {}

    defineNodeType(MockNode, 111, () => 'aaa');

    const node = new MockNode();

    // @ts-expect-error Subclass fields compiled with assignment semantics assign readonly properties
    node.nodeName = 'bbb';

    expect(node.nodeName).toBe('bbb');
    expect(new MockNode().nodeName).toBe('aaa');
  });

  test('is used by all node classes', () => {
    const nodes = [
      new CDATASection(),
      new Comment(),
      new Document(),
      new DocumentFragment(),
      new DocumentType('aaa'),
      new Element('aaa'),
      new ProcessingInstruction('aaa'),
      new Text(),
    ];

    for (const node of nodes) {
      expect(Object.keys(node)).not.toContain('nodeType');
      expect(Object.keys(node)).not.toContain('nodeName');
    }
  });
});
