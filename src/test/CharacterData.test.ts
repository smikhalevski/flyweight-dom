import { CharacterData } from '../main';

describe('CharacterData', () => {
  class MockCharacterData extends CharacterData {}

  test('cannot be instantiated directly', () => {
    expect(() => new (CharacterData as any)()).toThrow(new Error('Illegal constructor'));
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
});
