import { describe, expect, test } from 'vitest';
import { createElementFactory, h } from '../main/dsl.ts';
import {
  CDATASection,
  Comment,
  Document,
  DocumentFragment,
  DocumentType,
  Element,
  ProcessingInstruction,
  Text,
} from '../main/index.ts';

describe('h', () => {
  test('creates an element with attributes and text', () => {
    const element = h('span', { className: 'xxx' }, 'yyy');

    expect(element).toBeInstanceOf(Element);
    expect(element.tagName).toBe('span');
    expect(element.namespaceURI).toBeNull();
    expect(element.attributes.className).toBe('xxx');
    expect(element.childNodes.length).toBe(1);
    expect(element.childNodes[0]).toBeInstanceOf(Text);
  });

  test('creates an element without attributes', () => {
    const child = new Element('aaa');
    const element = h('bbb', child);

    expect(element.attributes).toStrictEqual({});
    expect(element.firstChild).toBe(child);
  });

  test('does not share attributes with the caller', () => {
    const attributes = { class: 'aaa' };
    const element1 = h('span', attributes);
    const element2 = h('span', attributes);

    element1.setAttribute('class', 'bbb');

    expect(attributes).toStrictEqual({ class: 'aaa' });
    expect(element2.getAttribute('class')).toBe('aaa');
  });

  test('skips null, undefined and boolean children', () => {
    expect(h('div', null, undefined, true, false).firstChild).toBeNull();
  });

  test('throws if a child is an object that is not a node', () => {
    // @ts-expect-error Objects aren't children
    expect(() => h('div', 'aaa', {})).toThrow('The value must be a Node or a primitive');
  });

  test('does not move children out of their parents if a child cannot be appended', () => {
    const text = new Text();
    const parent = new Element('aaa').append(text);

    expect(() => h('bbb', text, new Document())).toThrow('Node cannot be a child');
    expect(text.parentNode).toBe(parent);
  });
});

describe('createElementFactory', () => {
  test('creates elements with a namespace', () => {
    const s = createElementFactory('urn:111');
    const element = s('aaa', { bbb: 'ccc' }, s('ddd'));

    expect(element.namespaceURI).toBe('urn:111');
    expect(element.getAttribute('bbb')).toBe('ccc');
    expect(element.firstElementChild!.namespaceURI).toBe('urn:111');
  });
});

describe('h.document', () => {
  test('creates a document with children', () => {
    const element = h('html');
    const document = h.document(element);

    expect(document).toBeInstanceOf(Document);
    expect(Array.from(document)).toStrictEqual([element]);
  });

  test('does not move children out of their parents if a child cannot be appended', () => {
    const text = new Text();
    const parent = new Element('aaa').append(text);

    expect(() => h.document(text, new Document())).toThrow('Node cannot be a child');
    expect(text.parentNode).toBe(parent);
  });
});

describe('h.doctype', () => {
  test('creates a document type', () => {
    expect(h.doctype('aaa', 'bbb', 'ccc')).toStrictEqual(new DocumentType('aaa', 'bbb', 'ccc'));
  });
});

describe('h.fragment', () => {
  test('creates a fragment with children', () => {
    const element = h('aaa');
    const node = h.fragment(element, 'bbb');

    expect(node).toBeInstanceOf(DocumentFragment);
    expect(node.firstChild).toBe(element);
    expect(node.lastChild).toBeInstanceOf(Text);
  });

  test('does not move children out of their parents if a child cannot be appended', () => {
    const text = new Text();
    const parent = new Element('aaa').append(text);

    expect(() => h.fragment(text, new Document())).toThrow('Node cannot be a child');
    expect(text.parentNode).toBe(parent);
  });
});

describe('h.processingInstruction', () => {
  test('creates a processing instruction', () => {
    expect(h.processingInstruction('aaa', 'bbb')).toStrictEqual(new ProcessingInstruction('aaa', 'bbb'));
  });
});

describe('h.cdata', () => {
  test('creates a CDATA section', () => {
    expect(h.cdata('aaa')).toStrictEqual(new CDATASection('aaa'));
  });
});

describe('h.comment', () => {
  test('creates a comment', () => {
    expect(h.comment('aaa')).toStrictEqual(new Comment('aaa'));
  });
});
