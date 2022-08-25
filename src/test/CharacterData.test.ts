import { CharacterData, Node } from '../main';

describe('CharacterData', () => {
  test('creates a new CharacterData instance', () => {
    const node = new CharacterData(0);

    expect(node).toBeInstanceOf(Node);
    expect(node).toBeInstanceOf(CharacterData);
    expect(node.nodeType).toBe(0);
    expect(node.length).toBe(0);
    expect(node.data).toBe('');
    expect(node.nodeValue).toBe('');
  });

  test('creates a new CharacterData instance with nodeType', () => {
    const node = new CharacterData(111);

    expect(node.nodeType).toBe(111);
  });

  test('creates a new CharacterData instance with data', () => {
    const node = new CharacterData(0, 'aaa');

    expect(node.length).toBe(3);
  });

  test('data and nodeValue are synchronized', () => {
    const node = new CharacterData(0);

    node.data = 'aaa';

    expect(node.nodeValue).toBe('aaa');

    node.nodeValue = 'bbb';

    expect(node.data).toBe('bbb');
  });

  test('clears the data', () => {
    const node = new CharacterData(0, 'aaa');

    node.nodeValue = null;

    expect(node.data).toBe('');
  });

  test('data and length are synchronized', () => {
    const node = new CharacterData(0);

    node.data = 'aaa';

    expect(node.length).toBe(3);
  });

  test('appends data', () => {
    const node = new CharacterData(0, 'aaa');

    node.appendData('bbb');

    expect(node.data).toBe('aaabbb');
  });

  test('deletes data', () => {
    const node = new CharacterData(0, 'aaabbb');

    node.deleteData(2, 3);

    expect(node.data).toBe('aab');
  });

  test('replaces data', () => {
    const node = new CharacterData(0, 'aaabbb');

    node.replaceData(2, 3, 'ccc');

    expect(node.data).toBe('aacccb');
  });

  test('returns a data substring', () => {
    const node = new CharacterData(0, 'aaabbb');

    expect(node.substringData(2, 3)).toBe('abb');
    expect(node.data).toBe('aaabbb');
  });
});
