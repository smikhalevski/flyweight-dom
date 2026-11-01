import { expect, test } from 'vitest';
import { InsertPosition } from '../main/Element.js';
import { Comment, DOMTokenList, Element, Node, Text } from '../main/index.js';

test('creates an element without children', () => {
  const node = new Element('aaa');

  expect(node).toBeInstanceOf(Node);
  expect(node.nodeType).toBe(Node.ELEMENT_NODE);
  expect(node.nodeName).toBe('aaa');
  expect(node.tagName).toBe('aaa');
  expect(node.previousElementSibling).toBeNull();
  expect(node.nextElementSibling).toBeNull();
  expect(node.after).toBeInstanceOf(Function);
  expect(node.before).toBeInstanceOf(Function);
  expect(node.remove).toBeInstanceOf(Function);
  expect(node.replaceWith).toBeInstanceOf(Function);
  expect(node.children.length).toBe(0);
  expect(node.childElementCount).toBe(0);
  expect(node.firstElementChild).toBeNull();
  expect(node.lastElementChild).toBeNull();
  expect(node.append).toBeInstanceOf(Function);
  expect(node.prepend).toBeInstanceOf(Function);
  expect(node.replaceChildren).toBeInstanceOf(Function);
});

test('returns the id attribute', () => {
  const element = new Element('aaa', { id: 'bbb' });

  expect(element.id).toBe('bbb');
});

test('returns an empty string if the id attribute is absent', () => {
  const element = new Element('aaa');

  expect(element.id).toBe('');
});

test('sets the id attribute', () => {
  const element = new Element('aaa');

  element.id = 'bbb';

  expect(element.getAttribute('id')).toBe('bbb');
});

test('returns the class attribute', () => {
  const element = new Element('aaa', { class: 'bbb' });

  expect(element.className).toBe('bbb');
});

test('returns an empty string if the class attribute is absent', () => {
  const element = new Element('aaa');

  expect(element.className).toBe('');
});

test('sets the class attribute', () => {
  const element = new Element('aaa');

  element.className = 'bbb';

  expect(element.getAttribute('class')).toBe('bbb');
});

test('returns a classList backed by the class attribute', () => {
  const element = new Element('aaa', { class: 'bbb' });

  expect(element.classList).toBeInstanceOf(DOMTokenList);
  expect(element.classList.value).toBe('bbb');

  element.classList.add('ccc');

  expect(element.getAttribute('class')).toBe('bbb ccc');
});

test('adds a class to an element that has no attributes', () => {
  const element = new Element('aaa');

  element.classList.add('bbb');

  expect(element.getAttribute('class')).toBe('bbb');
});

test('returns the same classList', () => {
  const element = new Element('aaa');

  expect(element.classList).toBe(element.classList);
});

test('sets and gets an attribute', () => {
  const element = new Element('aaa');

  element.setAttribute('bbb', 'ccc');

  expect(element.getAttribute('bbb')).toBe('ccc');
});

test('sets an empty attribute if value is null', () => {
  const element = new Element('aaa');

  element.setAttribute('bbb', null);

  expect(element.getAttribute('bbb')).toBe('');
});

test('sets an attribute named __proto__', () => {
  const element = new Element('aaa');

  element.setAttribute('__proto__', 'bbb');

  expect(element.getAttribute('__proto__')).toBe('bbb');
});

test('returns null if attribute is absent', () => {
  const element = new Element('aaa');

  expect(element.getAttribute('bbb')).toBeNull();
});

test('does not treat inherited properties as attributes', () => {
  const element = new Element('aaa');

  expect(element.getAttribute('constructor')).toBeNull();
  expect(element.hasAttribute('toString')).toBe(false);
});

test('uses attributes passed to the constructor as is', () => {
  const attributes = { bbb: '111' };

  expect(new Element('aaa', attributes).attributes).toBe(attributes);
});

test('returns the same empty attributes object if no attributes were passed to the constructor', () => {
  const element = new Element('aaa');

  expect(element.attributes).toStrictEqual({});
  expect(element.attributes).toBe(element.attributes);
});

test('reads attributes that were written to the attributes object', () => {
  const element = new Element('aaa');

  element.attributes.bbb = '111';

  expect(element.getAttribute('bbb')).toBe('111');
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

test('does nothing if the removed attribute is absent', () => {
  const element = new Element('aaa');

  element.removeAttribute('bbb');

  expect(element.getAttributeNames()).toStrictEqual([]);
});

test('toggles an attribute on', () => {
  const element = new Element('aaa');

  expect(element.toggleAttribute('bbb')).toBe(true);
  expect(element.getAttribute('bbb')).toBe('');
});

test('toggles an attribute off', () => {
  const element = new Element('aaa', { bbb: '' });

  expect(element.toggleAttribute('bbb')).toBe(false);
  expect(element.getAttribute('bbb')).toBeNull();
});

test('force toggles an attribute on', () => {
  const element = new Element('aaa');

  expect(element.toggleAttribute('bbb', true)).toBe(true);
  expect(element.getAttribute('bbb')).toBe('');

  expect(element.toggleAttribute('bbb', true)).toBe(true);
  expect(element.getAttribute('bbb')).toBe('');
});

test('force toggles an attribute off', () => {
  const element = new Element('aaa', { bbb: '' });

  expect(element.toggleAttribute('bbb', false)).toBe(false);
  expect(element.getAttribute('bbb')).toBeNull();

  expect(element.toggleAttribute('bbb', false)).toBe(false);
  expect(element.getAttribute('bbb')).toBeNull();
});

test('returns attribute names', () => {
  const element = new Element('aaa', { bbb: '111', ccc: '222' });

  expect(element.getAttributeNames()).toEqual(['bbb', 'ccc']);
});

test('inserts an adjacent element before the element', () => {
  const element1 = new Element('aaa');
  const element2 = new Element('bbb');
  const element3 = new Element('ccc');

  element1.appendChild(element2);

  element2.insertAdjacentElement('beforeBegin', element3);

  expect(element1.firstChild).toBe(element3);
});

test('inserts an adjacent element as the first child', () => {
  const element1 = new Element('aaa');
  const element2 = new Element('bbb');
  const element3 = new Element('ccc');

  element1.appendChild(element2);

  element1.insertAdjacentElement('afterBegin', element3);

  expect(element1.firstChild).toBe(element3);
  expect(element1.lastElementChild).toBe(element2);
});

test('inserts an adjacent element as the last child', () => {
  const element1 = new Element('aaa');
  const element2 = new Element('bbb');
  const element3 = new Element('ccc');

  element1.appendChild(element2);

  element1.insertAdjacentElement('beforeEnd', element3);

  expect(element1.firstChild).toBe(element2);
  expect(element1.lastElementChild).toBe(element3);
});

test('inserts an adjacent element after the element', () => {
  const element1 = new Element('aaa');
  const element2 = new Element('bbb');
  const element3 = new Element('ccc');

  element1.appendChild(element2);

  element2.insertAdjacentElement('afterEnd', element3);

  expect(element1.lastChild).toBe(element3);
});

test('returns null if an adjacent element is inserted beside an element without a parent', () => {
  const element = new Element('aaa');

  expect(element.insertAdjacentElement('beforeBegin', new Element('bbb'))).toBeNull();
  expect(element.insertAdjacentElement('afterEnd', new Element('bbb'))).toBeNull();
});

test('accepts a lowercase position', () => {
  const element1 = new Element('aaa');
  const element2 = new Element('bbb');

  element1.insertAdjacentElement('beforeend', element2);

  expect(element1.firstChild).toBe(element2);
});

test('throws if the position is invalid', () => {
  const element1 = new Element('aaa');
  const element2 = new Element('bbb');

  expect(() => element1.insertAdjacentElement('xxx' as InsertPosition, element2)).toThrow(
    "The value provided ('xxx') is not one of 'beforeBegin', 'afterBegin', 'beforeEnd', or 'afterEnd'"
  );
});

test('inserts adjacent text before the element', () => {
  const element1 = new Element('aaa');
  const element2 = new Element('bbb');

  element1.appendChild(element2);

  element2.insertAdjacentText('beforeBegin', ' ccc ');

  expect(element1.firstChild).toEqual(new Text(' ccc '));
});

test('inserts adjacent text that is only whitespace', () => {
  const element1 = new Element('aaa');
  const element2 = new Element('bbb');

  element1.appendChild(element2);

  element2.insertAdjacentText('beforeBegin', ' \t');

  expect(element1.firstChild).toEqual(new Text(' \t'));
});

test('throws if adjacent text position is invalid and data is null', () => {
  // @ts-expect-error Data must be a string
  expect(() => new Element('aaa').insertAdjacentText('xxx' as InsertPosition, null)).toThrow(
    "The value provided ('xxx') is not one of 'beforeBegin', 'afterBegin', 'beforeEnd', or 'afterEnd'"
  );
});

test('shallow clones an element without its children', () => {
  const element1 = new Element('aaa');
  const element2 = new Element('bbb');

  element1.append(element2);

  const node = element1.cloneNode();

  expect(node).toBeInstanceOf(Element);
  expect(node.firstChild).toBeNull();
});

test('clones attributes into a new object', () => {
  const element = new Element('aaa', { bbb: '111' });

  const node = element.cloneNode();

  expect(node.attributes).toEqual({ bbb: '111' });
  expect(node.attributes).not.toBe(element.attributes);
});

test('does not share attributes with a clone of an element that has no attributes', () => {
  const element = new Element('aaa');

  element.cloneNode().setAttribute('bbb', '111');

  expect(element.hasAttribute('bbb')).toBe(false);
});

test('clones an instance of a subclass', () => {
  class MockElement extends Element {}

  const element = new MockElement('aaa');

  expect(element.cloneNode()).toBeInstanceOf(MockElement);
  expect(element.cloneNode().isEqualNode(element)).toBe(true);
});

test('deeply clones an element with its children', () => {
  const element1 = new Element('aaa');
  const element2 = new Element('bbb');

  element1.append(element2);

  const node = element1.cloneNode(true);

  expect(node).toBeInstanceOf(Element);
  expect(node.firstChild).not.toBe(element2);
  expect(node.firstChild!.nodeType).toBe(Node.ELEMENT_NODE);
});

test('elements are equal if tag names are equal', () => {
  expect(new Element('aaa').isEqualNode(new Element('aaa'))).toBe(true);
  expect(new Element('aaa').isEqualNode(new Element('bbb'))).toBe(false);
});

test('elements are equal if attributes are equal', () => {
  expect(new Element('aaa').setAttribute('xxx', 'yyy').isEqualNode(new Element('aaa').setAttribute('xxx', 'yyy'))).toBe(
    true
  );

  expect(new Element('aaa').setAttribute('xxx', 'yyy').isEqualNode(new Element('aaa'))).toBe(false);
  expect(new Element('aaa').isEqualNode(new Element('aaa').setAttribute('xxx', 'yyy'))).toBe(false);

  expect(new Element('aaa').setAttribute('qqq', 'ppp').isEqualNode(new Element('aaa').setAttribute('xxx', 'yyy'))).toBe(
    false
  );
});

test('an element without attributes is equal to an element with an empty attributes object', () => {
  expect(new Element('aaa').isEqualNode(new Element('aaa', {}))).toBe(true);
  expect(new Element('aaa', {}).isEqualNode(new Element('aaa'))).toBe(true);
});

test('compares attributes the same way regardless of the order of elements', () => {
  const element1 = new Element('aaa', Object.create({ xxx: 'yyy' }));
  const element2 = new Element('aaa', { xxx: 'yyy' });

  expect(element1.isEqualNode(element2)).toBe(element2.isEqualNode(element1));
});

test('elements are equal if children are equal', () => {
  expect(new Element('aaa').append('xxx').isEqualNode(new Element('aaa').append('xxx'))).toBe(true);

  expect(new Element('aaa').append('xxx').isEqualNode(new Element('aaa'))).toBe(false);
  expect(new Element('aaa').isEqualNode(new Element('aaa').append('xxx'))).toBe(false);

  expect(new Element('aaa').append('xxx').isEqualNode(new Element('aaa').append('yyy'))).toBe(false);
});

test('textContent joins the text of children', () => {
  const element = new Element('aaa').append(new Text('bbb'), new Text('ccc'));

  expect(element.textContent).toBe('bbbccc');
});

test('textContent includes nested text and ignores comments', () => {
  const element = new Element('aaa').append(new Comment('bbb'), 'ccc', new Element('ddd').append('eee'));

  expect(element.textContent).toBe('ccceee');
});

test('setting textContent replaces children', () => {
  const element = new Element('aaa').append(new Element('bbb'), 'ccc');

  element.textContent = 'ddd';

  expect(element.childNodes.length).toBe(1);
  expect(element.textContent).toBe('ddd');
});

test('setting an empty textContent removes children', () => {
  const element = new Element('aaa').append('bbb');

  element.textContent = '';

  expect(element.firstChild).toBeNull();
});

test('setting nodeValue does nothing', () => {
  const element = new Element('aaa');

  element.nodeValue = 'bbb';

  expect(element.nodeValue).toBeNull();
  expect(element.firstChild).toBeNull();
});
