import { expect, test } from 'vitest';
import { f } from '../main/dsl.js';
import { CDATASection, Comment, Document, Element, ProcessingInstruction, Text } from '../main/index.js';

test('creates a document with a doctype and the children of a fragment', () => {
  const doctype = f.doctype('html');
  const element = f.html();
  const document = f.doc(doctype, f.f(element));

  expect(document).toBeInstanceOf(Document);
  expect(Array.from(document)).toStrictEqual([doctype, element]);
});

test('creates an element with attributes and text', () => {
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

test('creates element factories after a factory named hasOwnProperty was created', () => {
  f.hasOwnProperty;

  expect(f.aaa()).toBeInstanceOf(Element);
});

test('creates a processing instruction, a CDATA section and a comment', () => {
  expect(f.pi('aaa', 'bbb')).toStrictEqual(new ProcessingInstruction('aaa', 'bbb'));
  expect(f.cdata('aaa')).toStrictEqual(new CDATASection('aaa'));
  expect(f.comment('aaa')).toStrictEqual(new Comment('aaa'));
});

test('skips null, undefined and boolean children', () => {
  expect(f.div(null, undefined, true, false).firstChild).toBeNull();
});

test('throws if a child is an object that is not a node', () => {
  // @ts-expect-error Objects aren't children
  expect(() => f.div('aaa', {})).toThrow('Cannot append a child');
});
