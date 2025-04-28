import { Document, DocumentType, Element, Node, Text } from '../main';

test('creates a new Document instance', () => {
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

test('returns a doctype', () => {
  const document = new Document();
  const doctype = new DocumentType('aaa');

  document.append(doctype);

  expect(document.doctype).toBe(doctype);
});

test('returns a document element', () => {
  const document = new Document();
  const element = new Element('aaa');

  document.append(element);

  expect(document.documentElement).toBe(element);
});

test('shallow clones a Document instance', () => {
  const document = new Document();
  const element = new Element('aaa');

  document.append(element);

  const node = document.cloneNode();

  expect(node).toBeInstanceOf(Document);
  expect(node.firstChild).toBeNull();
});

test('deeply clones a Document instance', () => {
  const document = new Document();
  const element = new Element('aaa');

  document.append(element);

  const node = document.cloneNode(true);

  expect(node).toBeInstanceOf(Document);
  expect(node.firstChild).not.toBe(element);
  expect(node.firstChild!.nodeType).toBe(Node.ELEMENT_NODE);
});

test('returns null textContent', () => {
  const document = new Document().append(new Element('aaa').append(new Text('bbb')));

  expect(document.textContent).toBeNull();
});
