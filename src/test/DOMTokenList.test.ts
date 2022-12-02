import { DOMTokenList } from '../main/DOMTokenList';

describe('DOMTokenList', () => {
  test('adds a new token to the list', () => {
    let value = '';

    const tokenList = new DOMTokenList({
      get: () => value,
      set: newValue => (value = newValue),
    });

    tokenList.add('aaa', 'bbb');

    expect(tokenList.value).toBe('aaa bbb');
  });
});
