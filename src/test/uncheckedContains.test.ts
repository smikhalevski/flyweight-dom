import { Element, Text } from '../main';
import { uncheckedAppendChild } from '../main/uncheckedAppendChild';
import { uncheckedContains } from '../main/uncheckedContains';

describe('uncheckedContains', () => {
  test('an elements contains itself', () => {
    const node = new Element('node');

    expect(uncheckedContains(node, node)).toBe(true);
  });

  test('returns true if element contains text', () => {
    const parent = new Element('parent');
    const node = new Text('node');

    uncheckedAppendChild(parent, node);

    expect(uncheckedContains(parent, node)).toBe(true);
  });

  test('returns false if element does not contain text', () => {
    const parent1 = new Element('parent1');
    const parent2 = new Element('parent2');
    const node1 = new Text('node1');
    const node2 = new Text('node2');

    uncheckedAppendChild(parent1, node1);
    uncheckedAppendChild(parent2, node2);

    expect(uncheckedContains(parent1, node2)).toBe(false);
  });

  test('returns true if an element contains a deeply nested text', () => {
    const parent1 = new Element('parent1');
    const parent2 = new Element('parent2');
    const node = new Text('node');

    uncheckedAppendChild(parent1, parent2);
    uncheckedAppendChild(parent2, node);

    expect(uncheckedContains(parent1, node)).toBe(true);
  });

  test('returns false if child contains parent', () => {
    const parent = new Element('parent');
    const node = new Text('node');

    uncheckedAppendChild(parent, node);

    expect(uncheckedContains(node, parent)).toBe(false);
  });
});
