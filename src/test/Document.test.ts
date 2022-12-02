import { Document, DocumentType, Element, Node } from '../main';

describe('Document', () => {
  test('creates a new Document instance', () => {
    const node = new Document();

    expect(node).toBeInstanceOf(Node);
    expect(node.nodeType).toBe(Node.DOCUMENT_NODE);
    expect(node.nodeName).toBe('#document');
    expect(node.doctype).toBe(null);
    expect(node.documentElement).toBe(null);
    expect(node.children.length).toBe(0);
    expect(node.childElementCount).toBe(0);
    expect(node.firstElementChild).toBe(null);
    expect(node.lastElementChild).toBe(null);
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
    expect(node.firstChild).toBe(null);
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
});
