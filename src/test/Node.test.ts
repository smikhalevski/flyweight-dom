import { describe, expect, test } from 'vitest';
import { ChildNode, Document, DocumentFragment, Element, Node, ParentNode, Text } from '../main/index.ts';
import { EmptyNodeList, ChildNodeList } from '../main/NodeList.ts';

class MockNode extends Node {
  readonly nodeName = '';
  readonly nodeType = -1;
}

class MockParentNode extends ParentNode(ChildNode()) {
  readonly nodeName = '';
  readonly nodeType = -1;
}

test('node classes inherit node type constants', () => {
  // @ts-expect-error Mixins drop statics from the class type, but classes still inherit them at runtime
  expect(Element.ELEMENT_NODE).toBe(1);
});

test('creates a node without a parent and children', () => {
  const node = new MockNode();

  expect(node).toBeInstanceOf(Node);
  expect(node.childNodes).toBeInstanceOf(EmptyNodeList);
  expect(node.parentNode).toBeNull();
  expect(node.parentElement).toBeNull();
  expect(node.previousSibling).toBeNull();
  expect(node.nextSibling).toBeNull();
  expect(node.firstChild).toBeNull();
  expect(node.lastChild).toBeNull();
  expect(node.nodeType).toBe(-1);
  expect(node.nodeName).toBe('');
});

test('childNodes of a parent node is a ChildNodeList', () => {
  expect(new Element('aaa').childNodes).toBeInstanceOf(ChildNodeList);
});

test('returns the same childNodes of a node that cannot have children', () => {
  const node = new MockNode();

  expect(node.childNodes).toBe(node.childNodes);
});

test('nodes that cannot have children share one frozen childNodes', () => {
  expect(new MockNode().childNodes).toBe(new Text().childNodes);
  expect(Object.isFrozen(new Text().childNodes)).toBe(true);
});

test('nodes that cannot have children have no fields for child lists', () => {
  expect(Object.getOwnPropertyNames(new Text('aaa'))).toStrictEqual([
    'parentNode',
    'previousSibling',
    'nextSibling',
    'firstChild',
    'lastChild',
    'data',
  ]);
});

test('reading childNodes, children, classList and attributes does not add properties to nodes', () => {
  const element = new Element('aaa');
  const document = new Document();
  const fragment = new DocumentFragment();
  const parentNode = new MockParentNode();
  const text = new Text();
  const nodes = [element, document, fragment, parentNode, text];
  const propertyNames = nodes.map(node => Object.getOwnPropertyNames(node));

  element.childNodes;
  element.children;
  element.classList;
  element.attributes;
  document.childNodes;
  document.children;
  fragment.childNodes;
  fragment.children;
  parentNode.childNodes;
  parentNode.children;
  text.childNodes;

  expect(nodes.map(node => Object.getOwnPropertyNames(node))).toStrictEqual(propertyNames);
});

test('hasChildNodes returns false for a node without children', () => {
  const node = new MockNode();

  expect(node.hasChildNodes()).toBe(false);
});

test('child mutation methods of a base node throw', () => {
  const node = new MockNode();

  const text = new Text();

  expect(() => node.appendChild(text)).toThrow('This node type does not support this method');
  expect(() => node.insertBefore(text, null)).toThrow('This node type does not support this method');
  expect(() => node.removeChild(text)).toThrow('This node type does not support this method');
  expect(() => node.replaceChild(text, text)).toThrow('This node type does not support this method');
});

test('cloneNode of a base node throws', () => {
  expect(() => new MockNode().cloneNode()).toThrow('This node type does not support this method');
});

test('a base node can be appended to an element', () => {
  const node = new MockNode();
  const element = new Element('aaa');

  expect(element.appendChild(node)).toBe(node);
  expect(element.firstChild).toBe(node);
});

test('parentElement is null if parent is not an element', () => {
  const node = new Text();

  new Element('aaa').appendChild(new MockParentNode()).appendChild(node);

  expect(node.parentElement).toBeNull();
});

test('contains a descendant', () => {
  const text = new Text();

  expect(new Element('aaa').append(new Element('bbb').append(text)).contains(text)).toBe(true);
});

test('does not contain null or undefined', () => {
  expect(new Element('aaa').contains(null)).toBe(false);
  expect(new Element('aaa').contains(undefined)).toBe(false);
});

test('returns the namespace that the prefix is bound to at the node', () => {
  const text = new Text();

  new Element('aaa', { 'xmlns:xxx': 'urn:111' }).append(text);

  expect(text.lookupNamespaceURI('xxx')).toBe('urn:111');
});

test('returns the prefix that is bound to the namespace at the node', () => {
  const text = new Text();

  new Element('aaa', { 'xmlns:xxx': 'urn:111' }).append(text);

  expect(text.lookupPrefix('urn:111')).toBe('xxx');
});

describe('Node.getRootNode', () => {
  test('returns the root of the tree', () => {
    const text = new Text('xxx');
    const root = new Element('aaa').append(new Element('bbb').append(text));

    expect(text.getRootNode()).toBe(root);
  });

  test('returns the node itself if it has no parent', () => {
    const node = new Element('aaa');

    expect(node.getRootNode()).toBe(node);
  });
});

describe('Node.compareDocumentPosition', () => {
  test('returns 0 for the node itself', () => {
    const node = new Element('aaa');

    expect(node.compareDocumentPosition(node)).toBe(0);
  });

  test('tells that a sibling precedes or follows the node', () => {
    const element1 = new Element('bbb');
    const element2 = new Element('ccc');

    new Element('aaa').append(element1, new Text('xxx'), element2);

    expect(element1.compareDocumentPosition(element2)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(element2.compareDocumentPosition(element1)).toBe(Node.DOCUMENT_POSITION_PRECEDING);
  });

  test('tells that a descendant is contained by the node, and an ancestor contains it', () => {
    const text = new Text('xxx');
    const root = new Element('aaa').append(new Element('bbb').append(text));

    expect(root.compareDocumentPosition(text)).toBe(
      Node.DOCUMENT_POSITION_CONTAINED_BY | Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(text.compareDocumentPosition(root)).toBe(Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_PRECEDING);
  });

  test('compares nodes at different depths in different subtrees', () => {
    const element1 = new Element('ccc');
    const element2 = new Element('ddd');

    new Element('aaa').append(new Element('bbb').append(element1), element2);

    expect(element1.compareDocumentPosition(element2)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(element2.compareDocumentPosition(element1)).toBe(Node.DOCUMENT_POSITION_PRECEDING);
  });

  test('tells the same order of nodes of different trees each time', () => {
    const element1 = new Element('bbb');
    const element2 = new Element('ddd');
    const root1 = new Element('aaa').append(element1);
    const root2 = new Element('ccc').append(element2);
    const position = element1.compareDocumentPosition(element2);

    expect(position & ~(Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_POSITION_FOLLOWING)).toBe(
      Node.DOCUMENT_POSITION_DISCONNECTED | Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
    );
    expect(root1.compareDocumentPosition(root2)).toBe(position);
    expect(element2.compareDocumentPosition(element1)).toBe(
      position ^ (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_POSITION_FOLLOWING)
    );
  });
});
