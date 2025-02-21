import { Document, Element, Text } from '../main';
import h from '../main/dsl';

describe('DSL', () => {
  test('creates an document', () => {
    const fragment = h.f(h.div(h.span({ className: 'xxx' }, 'yyy')));

    const document = h.doc(h.doctype('html'), fragment);

    expect(document).toBeInstanceOf(Document);
  });

  test('creates an element', () => {
    const element = h.span({ className: 'xxx' }, 'yyy');

    expect(element).toBeInstanceOf(Element);
    expect(element.tagName).toBe('span');
    expect(element.attributes.className).toBe('xxx');
    expect(element.childNodes.length).toBe(1);
    expect(element.childNodes[0]).toBeInstanceOf(Text);
  });
});
