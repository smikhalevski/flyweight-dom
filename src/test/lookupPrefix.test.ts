import { expect, test } from 'vitest';
import { Element, lookupPrefix } from '../main/index.ts';

test('returns the prefix that an ancestor declares for the namespace', () => {
  const parent = new Element('aaa', { 'xmlns:xxx': 'urn:111' });
  const child = new Element('bbb');

  parent.append(child);

  expect(lookupPrefix(child, 'urn:111')).toBe('xxx');
});

test('returns the prefix of an element that has the namespace', () => {
  expect(lookupPrefix(new Element('xxx:aaa', {}, 'urn:111'), 'urn:111')).toBe('xxx');
});

test('returns null if the namespace is the default namespace', () => {
  expect(lookupPrefix(new Element('aaa', { xmlns: 'urn:111' }, 'urn:111'), 'urn:111')).toBeNull();
});
