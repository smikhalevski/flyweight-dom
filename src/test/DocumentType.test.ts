import { DocumentType, Node } from '../main';

test('creates a new DocumentType instance', () => {
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

test('creates a new DocumentType instance with IDs', () => {
  const node = new DocumentType('aaa', 'bbb', 'ccc');

  expect(node.publicId).toBe('bbb');
  expect(node.systemId).toBe('ccc');
});

test('clones a DocumentType instance', () => {
  const node = new DocumentType('aaa', 'bbb', 'ccc').cloneNode() as DocumentType;

  expect(node.nodeName).toBe('aaa');
  expect(node.publicId).toBe('bbb');
  expect(node.systemId).toBe('ccc');
});
