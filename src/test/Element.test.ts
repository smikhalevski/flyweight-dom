import { Element, Text } from '../main';

describe('Element', () => {
  test('', () => {
    const element = new Element('a');
    const text = new Text('aaa');

    element.appendChild(text);

    expect(element.hasOwnProperty('childNodes')).toBe(false);
  });
});
