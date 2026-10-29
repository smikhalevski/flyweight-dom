import { expect, test } from 'vitest';
import { f } from '../main/dsl.js';
import { Document, Element, Text } from '../main/index.js';

test('creates an document', () => {
  const fragment = f.f(f.div(f.span({ className: 'xxx' }, 'yyy')));

  const document = f.doc(f.doctype('html'), fragment);

  expect(document).toBeInstanceOf(Document);
});

test('creates an element', () => {
  const element = f.span({ className: 'xxx' }, 'yyy');

  expect(element).toBeInstanceOf(Element);
  expect(element.tagName).toBe('span');
  expect(element.attributes.className).toBe('xxx');
  expect(element.childNodes.length).toBe(1);
  expect(element.childNodes[0]).toBeInstanceOf(Text);
});
