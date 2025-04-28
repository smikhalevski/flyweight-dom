import { DocumentFragment, Element, Node, Text } from '../main';

test('creates a new DocumentFragment instance', () => {
  const node = new DocumentFragment();

  expect(node).toBeInstanceOf(Node);
  expect(node.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
  expect(node.nodeName).toBe('#document-fragment');
  expect(node.children.length).toBe(0);
  expect(node.childElementCount).toBe(0);
  expect(node.firstElementChild).toBeNull();
  expect(node.lastElementChild).toBeNull();
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
  expect(node.firstChild).toBeNull();
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

test('returns concatenated textContent', () => {
  const fragment = new DocumentFragment().append(new Element('aaa').append(new Text('bbb'), new Text('ccc')));

  expect(fragment.textContent).toBe('bbbccc');
});

test('setting textContent replaces children', () => {
  const fragment = new DocumentFragment().append(new Element('aaa').append(new Text('bbb'), new Text('ccc')));

  fragment.textContent = 'ddd';

  expect(fragment.textContent).toBe('ddd');
  expect(fragment.firstChild).toBeInstanceOf(Text);
});
