import { CharacterData, Node } from '../main';

describe('CharacterData', () => {
  class MockCharacterData extends CharacterData {
    readonly nodeType = -1;
    readonly nodeName = '';
  }

  test('creates a CharacterData instance', () => {
    const node = new MockCharacterData();

    expect(node).toBeInstanceOf(Node);
    expect(node.previousElementSibling).toBe(null);
    expect(node.nextElementSibling).toBe(null);
    expect(node.after).toBeInstanceOf(Function);
    expect(node.before).toBeInstanceOf(Function);
    expect(node.remove).toBeInstanceOf(Function);
    expect(node.replaceWith).toBeInstanceOf(Function);
  });

  test('data and length are synchronized', () => {
    const node = new MockCharacterData();
    node.data = 'aaa';

    expect(node.length).toBe(3);
  });

  test('appends data', () => {
    const node = new MockCharacterData();
    node.data = 'aaa';

    node.appendData('bbb');

    expect(node.data).toBe('aaabbb');
  });

  test('data, nodeValue, and textContent are synchronized', () => {
    const node = new MockCharacterData();

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
    const node = new MockCharacterData();
    node.data = 'aaa';

    node.nodeValue = null;

    expect(node.data).toBe('');
  });

  test('deletes data', () => {
    const node = new MockCharacterData();
    node.data = 'aaabbb';

    node.deleteData(2, 3);

    expect(node.data).toBe('aab');
  });

  test('replaces data', () => {
    const node = new MockCharacterData();
    node.data = 'aaabbb';

    node.replaceData(2, 3, 'ccc');

    expect(node.data).toBe('aacccb');
  });

  test('returns a data substring', () => {
    const node = new MockCharacterData();
    node.data = 'aaabbb';

    expect(node.substringData(2, 3)).toBe('abb');
    expect(node.data).toBe('aaabbb');
  });

  test('clones a CharacterData instance', () => {
    const node = new MockCharacterData().cloneNode() as MockCharacterData;
    node.data = 'aaa';

    expect(node).toBeInstanceOf(MockCharacterData);
    expect(node.data).toBe('aaa');
  });
});
