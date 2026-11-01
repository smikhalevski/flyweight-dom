import { expect, test } from 'vitest';
import { DocumentType, Node } from '../main/index.js';

test('creates a doctype with empty IDs', () => {
  const node = new DocumentType('aaa');

  expect(node).toBeInstanceOf(Node);
  expect(node.nodeType).toBe(Node.DOCUMENT_TYPE_NODE);
  expect(node.nodeName).toBe('aaa');
  expect(node.name).toBe('aaa');
  expect(node.publicId).toBe('');
  expect(node.systemId).toBe('');

  expect(node.previousElementSibling).toBeNull();
  expect(node.nextElementSibling).toBeNull();
  expect(node.after).toBeInstanceOf(Function);
  expect(node.before).toBeInstanceOf(Function);
  expect(node.remove).toBeInstanceOf(Function);
  expect(node.replaceWith).toBeInstanceOf(Function);
});

test('creates a doctype with public and system IDs', () => {
  const node = new DocumentType('aaa', 'bbb', 'ccc');

  expect(node.publicId).toBe('bbb');
  expect(node.systemId).toBe('ccc');
});

test('clones a doctype', () => {
  const node = new DocumentType('aaa', 'bbb', 'ccc').cloneNode() as DocumentType;

  expect(node.nodeName).toBe('aaa');
  expect(node.publicId).toBe('bbb');
  expect(node.systemId).toBe('ccc');
});

test('clones an instance of a subclass', () => {
  class MockDocumentType extends DocumentType {}

  expect(new MockDocumentType('aaa').cloneNode()).toBeInstanceOf(MockDocumentType);
});

test('doctypes are equal if name, publicId and systemId are equal', () => {
  expect(new DocumentType('aaa', 'bbb', 'ccc').isEqualNode(new DocumentType('aaa', 'bbb', 'ccc'))).toBe(true);

  expect(new DocumentType('aaa', 'bbb', 'ccc').isEqualNode(new DocumentType('xxx', 'bbb', 'ccc'))).toBe(false);
  expect(new DocumentType('aaa', 'bbb', 'ccc').isEqualNode(new DocumentType('aaa', 'xxx', 'ccc'))).toBe(false);
  expect(new DocumentType('aaa', 'bbb', 'ccc').isEqualNode(new DocumentType('aaa', 'bbb', 'xxx'))).toBe(false);
});
