import { expect, test } from 'vitest';
import { Document, DocumentType, Element, Node, Text } from '../main/index.js';

test('creates an empty document', () => {
  const node = new Document();

  expect(node).toBeInstanceOf(Node);
  expect(node.nodeType).toBe(Node.DOCUMENT_NODE);
  expect(node.nodeName).toBe('#document');
  expect(node.doctype).toBeNull();
  expect(node.documentElement).toBeNull();
  expect(node.children.length).toBe(0);
  expect(node.childElementCount).toBe(0);
  expect(node.firstElementChild).toBeNull();
  expect(node.lastElementChild).toBeNull();
  expect(node.append).toBeInstanceOf(Function);
  expect(node.prepend).toBeInstanceOf(Function);
  expect(node.replaceChildren).toBeInstanceOf(Function);
});

test('returns the doctype', () => {
  const document = new Document();
  const doctype = new DocumentType('aaa');

  document.append(doctype);

  expect(document.doctype).toBe(doctype);
});

test('returns the document element', () => {
  const document = new Document();
  const element = new Element('aaa');

  document.append(element);

  expect(document.documentElement).toBe(element);
});

test('shallow clones a document without its children', () => {
  const document = new Document();
  const element = new Element('aaa');

  document.append(element);

  const node = document.cloneNode();

  expect(node).toBeInstanceOf(Document);
  expect(node.firstChild).toBeNull();
});

test('deeply clones a document with its children', () => {
  const document = new Document();
  const element = new Element('aaa');

  document.append(element);

  const node = document.cloneNode(true);

  expect(node).toBeInstanceOf(Document);
  expect(node.firstChild).not.toBe(element);
  expect(node.firstChild!.nodeType).toBe(Node.ELEMENT_NODE);
});

test('textContent is null', () => {
  const document = new Document().append(new Element('aaa').append(new Text('bbb')));

  expect(document.textContent).toBeNull();
});

test('clones an instance of a subclass', () => {
  class MockDocument extends Document {}

  expect(new MockDocument().cloneNode()).toBeInstanceOf(MockDocument);
});

test('setting textContent does nothing', () => {
  const document = new Document();

  document.textContent = 'aaa';

  expect(document.firstChild).toBeNull();
});
