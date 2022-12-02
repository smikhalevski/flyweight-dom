import { DocumentFragment, Element, Node } from '../main';

describe('DocumentFragment', () => {
  test('creates a new DocumentFragment instance', () => {
    const node = new DocumentFragment();

    expect(node).toBeInstanceOf(Node);
    expect(node.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
    expect(node.nodeName).toBe('#document-fragment');
    expect(node.children.length).toBe(0);
    expect(node.childElementCount).toBe(0);
    expect(node.firstElementChild).toBe(null);
    expect(node.lastElementChild).toBe(null);
    expect(node.append).toBeInstanceOf(Function);
    expect(node.prepend).toBeInstanceOf(Function);
    expect(node.replaceChildren).toBeInstanceOf(Function);
  });

  test('shallow clones a DocumentFragment instance', () => {
    const fragment = new DocumentFragment();
    const element = new Element('aaa');

    fragment.append(element);

    const node = fragment.cloneNode();

    expect(node).toBeInstanceOf(DocumentFragment);
    expect(node.firstChild).toBe(null);
  });

  test('deeply clones a DocumentFragment instance', () => {
    const fragment = new DocumentFragment();
    const element = new Element('aaa');

    fragment.append(element);

    const node = fragment.cloneNode(true);

    expect(node).toBeInstanceOf(DocumentFragment);
    expect(node.firstChild).not.toBe(element);
    expect(node.firstChild!.nodeType).toBe(Node.ELEMENT_NODE);
  });
});
