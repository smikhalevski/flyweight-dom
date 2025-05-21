import { expect, test } from 'vitest';
import { Document, Element, Text } from '../main/index.js';
import dsl from '../main/dsl.js';

test('creates an document', () => {
  const fragment = dsl.f(dsl.div(dsl.span({ className: 'xxx' }, 'yyy')));

  const document = dsl.doc(dsl.doctype('html'), fragment);

  expect(document).toBeInstanceOf(Document);
});

test('creates an element', () => {
  const element = dsl.span({ className: 'xxx' }, 'yyy');

  expect(element).toBeInstanceOf(Element);
  expect(element.tagName).toBe('span');
  expect(element.attributes.className).toBe('xxx');
  expect(element.childNodes.length).toBe(1);
  expect(element.childNodes[0]).toBeInstanceOf(Text);
});
