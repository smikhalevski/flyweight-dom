import { DOMTokenList, Element, Node } from '../main';

describe('Element', () => {
  test('creates an Element instance', () => {
    const node = new Element('aaa');

    expect(node).toBeInstanceOf(Node);
    expect(node.nodeType).toBe(Node.ELEMENT_NODE);
    expect(node.nodeName).toBe('aaa');
    expect(node.tagName).toBe('aaa');
    expect(node.previousElementSibling).toBe(null);
    expect(node.nextElementSibling).toBe(null);
    expect(node.after).toBeInstanceOf(Function);
    expect(node.before).toBeInstanceOf(Function);
    expect(node.remove).toBeInstanceOf(Function);
    expect(node.replaceWith).toBeInstanceOf(Function);
    expect(node.children.length).toBe(0);
    expect(node.childElementCount).toBe(0);
    expect(node.firstElementChild).toBe(null);
    expect(node.lastElementChild).toBe(null);
    expect(node.append).toBeInstanceOf(Function);
    expect(node.prepend).toBeInstanceOf(Function);
    expect(node.replaceChildren).toBeInstanceOf(Function);
  });

  test('returns an id attribute', () => {
    const element = new Element('aaa', { id: 'bbb' });

    expect(element.id).toBe('bbb');
  });

  test('returns an empty string if id attribute is empty', () => {
    const element = new Element('aaa');

    expect(element.id).toBe('');
  });

  test('sets id attribute', () => {
    const element = new Element('aaa');

    element.id = 'bbb';

    expect(element.getAttribute('id')).toBe('bbb');
  });

  test('returns a class attribute', () => {
    const element = new Element('aaa', { class: 'bbb' });

    expect(element.className).toBe('bbb');
  });

  test('returns an empty string if class attribute is empty', () => {
    const element = new Element('aaa');

    expect(element.className).toBe('');
  });

  test('sets class attribute', () => {
    const element = new Element('aaa');

    element.className = 'bbb';

    expect(element.getAttribute('class')).toBe('bbb');
  });

  test('returns a DOMTokenList backed by a class attribute', () => {
    const element = new Element('aaa', { class: 'bbb' });

    expect(element.classList).toBeInstanceOf(DOMTokenList);
    expect(element.classList.value).toBe('bbb');

    element.classList.add('ccc');

    expect(element.getAttribute('class')).toBe('bbb ccc');
  });

  test('returns the same DOMTokenList instance', () => {
    const element = new Element('aaa');

    expect(element.classList).toBe(element.classList);
  });

  test('sets/gets an attribute', () => {
    const element = new Element('aaa');

    element.setAttribute('bbb', 'ccc');

    expect(element.getAttribute('bbb')).toBe('ccc');
  });

  test('returns null if attribute is absent', () => {
    const element = new Element('aaa');

    expect(element.getAttribute('bbb')).toBe(null);
  });

  test('returns true if an attribute is present', () => {
    const element = new Element('aaa', { bbb: 'ccc' });

    expect(element.hasAttribute('bbb')).toBe(true);
    expect(element.hasAttribute('ccc')).toBe(false);
  });

  test('removes an attribute', () => {
    const element = new Element('aaa', { bbb: 'ccc' });

    element.removeAttribute('bbb');

    expect(element.hasAttribute('bbb')).toBe(false);
  });

  test('returns a list of attribute names', () => {
    const element = new Element('aaa', { bbb: '111', ccc: '222' });

    expect(element.getAttributeNames()).toEqual(['bbb', 'ccc']);
  });

  test('shallow clones an Element instance', () => {
    const element1 = new Element('aaa');
    const element2 = new Element('bbb');

    element1.append(element2);

    const node = element1.cloneNode();

    expect(node).toBeInstanceOf(Element);
    expect(node.firstChild).toBe(null);
  });

  test('deeply clones an Element instance', () => {
    const element1 = new Element('aaa');
    const element2 = new Element('bbb');

    element1.append(element2);

    const node = element1.cloneNode(true);

    expect(node).toBeInstanceOf(Element);
    expect(node.firstChild).not.toBe(element2);
    expect(node.firstChild!.nodeType).toBe(Node.ELEMENT_NODE);
  });
});
