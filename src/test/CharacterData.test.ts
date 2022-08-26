import { CharacterData, Node } from '../main';

describe('CharacterData', () => {
  test('creates a new CharacterData instance', () => {
    const node = new CharacterData(0, '#node');

    expect(node).toBeInstanceOf(Node);
    expect(node).toBeInstanceOf(CharacterData);
    expect(node.nodeType).toBe(0);
    expect(node.length).toBe(0);
    expect(node.data).toBe('');
    expect(node.nodeValue).toBe('');
    expect(node.nodeName).toBe('#node');
  });

  test('creates a new CharacterData instance with nodeType', () => {
    const node = new CharacterData(111, '#node');

    expect(node.nodeType).toBe(111);
  });

  test('creates a new CharacterData instance with data', () => {
    const node = new CharacterData(0, '#node', 'aaa');

    expect(node.length).toBe(3);
  });

  test('data, nodeValue, and textContent are synchronized', () => {
    const node = new CharacterData(0, '#node', '#node');

    node.data = 'aaa';

    expect(node.data).toBe('aaa');
    expect(node.nodeValue).toBe('aaa');
    expect(node.textContent).toBe('aaa');

    node.textContent = 'bbb';

    expect(node.data).toBe('bbb');
    expect(node.nodeValue).toBe('bbb');
    expect(node.textContent).toBe('bbb');

    node.textContent = null;

    expect(node.data).toBe('');
    expect(node.textContent).toBe('');

    node.nodeValue = 'bbb';

    expect(node.data).toBe('bbb');
    expect(node.nodeValue).toBe('bbb');
    expect(node.textContent).toBe('bbb');

    node.nodeValue = null;

    expect(node.data).toBe('');
    expect(node.nodeValue).toBe('');
    expect(node.textContent).toBe('');
  });

  test('clears the data', () => {
    const node = new CharacterData(0, '#node', 'aaa');

    node.nodeValue = null;

    expect(node.data).toBe('');
  });

  test('data and length are synchronized', () => {
    const node = new CharacterData(0, '#node', '#node');

    node.data = 'aaa';

    expect(node.length).toBe(3);
  });

  test('appends data', () => {
    const node = new CharacterData(0, '#node', 'aaa');

    node.appendData('bbb');

    expect(node.data).toBe('aaabbb');
  });

  test('deletes data', () => {
    const node = new CharacterData(0, '#node', 'aaabbb');

    node.deleteData(2, 3);

    expect(node.data).toBe('aab');
  });

  test('replaces data', () => {
    const node = new CharacterData(0, '#node', 'aaabbb');

    node.replaceData(2, 3, 'ccc');

    expect(node.data).toBe('aacccb');
  });

  test('returns a data substring', () => {
    const node = new CharacterData(0, '#node', 'aaabbb');

    expect(node.substringData(2, 3)).toBe('abb');
    expect(node.data).toBe('aaabbb');
  });
});
