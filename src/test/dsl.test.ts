import { expect, test } from 'vitest';
import { f } from '../main/dsl.js';
import { Document, Element, Text } from '../main/index.js';

test('creates a document', () => {
  const doctype = f.doctype('html');
  const element = f.html();
  const document = f.doc(doctype, f.f(element));

  expect(document).toBeInstanceOf(Document);
  expect(Array.from(document)).toStrictEqual([doctype, element]);
});

test('creates an element', () => {
  const element = f.span({ className: 'xxx' }, 'yyy');

  expect(element).toBeInstanceOf(Element);
  expect(element.tagName).toBe('span');
  expect(element.attributes.className).toBe('xxx');
  expect(element.childNodes.length).toBe(1);
  expect(element.childNodes[0]).toBeInstanceOf(Text);
});

test('does not share attributes with the caller', () => {
  const attributes = { class: 'aaa' };
  const element1 = f.span(attributes);
  const element2 = f.span(attributes);

  element1.setAttribute('class', 'bbb');

  expect(attributes).toStrictEqual({ class: 'aaa' });
  expect(element2.getAttribute('class')).toBe('aaa');
});

test('creates element factories after hasOwnProperty is read', () => {
  f.hasOwnProperty;

  expect(f.aaa()).toBeInstanceOf(Element);
});
