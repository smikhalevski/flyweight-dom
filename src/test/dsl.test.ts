import { Document } from '../main';
import h from '../main/dsl';

describe('DSL', () => {
  test('creates an element', () => {
    const fragment = h.f(h.div(h.span({ className: 'xxx' }, 'Hello')));

    const document = h.doc(h.doctype('html'), fragment);

    expect(document).toBeInstanceOf(Document);
  });
});
