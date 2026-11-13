import { expect, test } from 'vitest';
import { Document, Element, Text, XML_NAMESPACE, XMLNS_NAMESPACE } from '../main/index.ts';
import { lookupNamespaceURI } from '../main/lookupNamespaceURI.ts';

test('returns the namespace that an ancestor declares for the prefix', () => {
  const parent = new Element('aaa', { 'xmlns:xxx': 'urn:111' });
  const child = new Element('bbb');

  parent.append(child);

  expect(lookupNamespaceURI(child, 'xxx')).toBe('urn:111');
});

test('returns the default namespace if the prefix is null', () => {
  const element = new Element('aaa', { xmlns: 'urn:111' });

  expect(lookupNamespaceURI(element, null)).toBe('urn:111');
});

test('returns the namespace of an element that has the prefix and does not declare it', () => {
  const element = new Element('xxx:aaa', {}, 'urn:111');

  expect(lookupNamespaceURI(element, 'xxx')).toBe('urn:111');
});

test('returns the closest declaration', () => {
  const parent = new Element('aaa', { 'xmlns:xxx': 'urn:111' });
  const child = new Element('bbb', { 'xmlns:xxx': 'urn:222' });

  parent.append(child);

  expect(lookupNamespaceURI(child, 'xxx')).toBe('urn:222');
});

test('returns null if an empty xmlns attribute removes the default namespace', () => {
  const parent = new Element('aaa', { xmlns: 'urn:111' });
  const child = new Element('bbb', { xmlns: '' });

  parent.append(child);

  expect(lookupNamespaceURI(child, null)).toBeNull();
});

test('returns null if the prefix is not bound', () => {
  expect(lookupNamespaceURI(new Element('aaa'), 'xxx')).toBeNull();
});

test('returns namespaces of xml and xmlns prefixes', () => {
  const element = new Element('aaa');

  expect(lookupNamespaceURI(element, 'xml')).toBe(XML_NAMESPACE);
  expect(lookupNamespaceURI(element, 'xmlns')).toBe(XMLNS_NAMESPACE);
});

test('starts at the parent of a text node', () => {
  const text = new Text('aaa');

  new Element('aaa', { 'xmlns:xxx': 'urn:111' }).append(text);

  expect(lookupNamespaceURI(text, 'xxx')).toBe('urn:111');
});

test('starts at the document element of a document', () => {
  const document = new Document();

  document.append(new Element('aaa', { 'xmlns:xxx': 'urn:111' }));

  expect(lookupNamespaceURI(document, 'xxx')).toBe('urn:111');
});
