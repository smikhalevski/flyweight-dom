import { beforeEach, describe, expect, test, vi } from 'vitest';
import { DOMTokenList, ValueAccessor } from '../main/index.js';

let valueMock: string | null = '';

const valueAccessorMock: ValueAccessor = {
  get: () => valueMock,
  set: value => {
    valueMock = value;
  },
};

beforeEach(() => {
  valueMock = '';
});

test('creates an empty token list', () => {
  const node = new DOMTokenList(valueAccessorMock);

  expect(node.length).toBe(0);
  expect(node.value).toBe('');
  expect(node.add).toBeInstanceOf(Function);
  expect(node.remove).toBeInstanceOf(Function);
  expect(node.replace).toBeInstanceOf(Function);
  expect(node.toggle).toBeInstanceOf(Function);
  expect(node.contains).toBeInstanceOf(Function);
  expect(node.item).toBeInstanceOf(Function);
  expect(node.forEach).toBeInstanceOf(Function);
});

test('returns the number of tokens', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  valueMock = 'aaa   bbb';

  expect(tokenList.length).toBe(2);
});

test('returns the underlying value as is', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  valueMock = 'aaa   bbb';

  expect(tokenList.value).toBe('aaa   bbb');
});

test('sets the underlying value as is', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  tokenList.value = 'aaa   bbb';

  expect(valueMock).toBe('aaa   bbb');
});

test('adds tokens', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  tokenList.add('aaa', 'bbb');
  tokenList.add('ccc');

  expect(tokenList.value).toBe('aaa bbb ccc');
  expect(tokenList.length).toBe(3);
});

test('does not add a token that is already present', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  valueMock = 'aaa';
  tokenList.add('aaa');

  expect(tokenList.value).toBe('aaa');
});

test('throws if an added token is empty', () => {
  expect(() => new DOMTokenList(valueAccessorMock).add('')).toThrow('The token provided must not be empty');
});

test('throws if an added token contains whitespace, and adds nothing', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  tokenList.add('ccc');
  expect(() => tokenList.add('aaa', 'b\tbb')).toThrow(
    "The token provided ('b	bb') contains HTML space characters, which are not valid in tokens"
  );

  expect(tokenList.value).toBe('ccc');
});

test('removes tokens', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  tokenList.add('aaa', 'bbb', 'ccc');
  tokenList.remove('aaa', 'ccc');

  expect(tokenList.value).toBe('bbb');
  expect(tokenList.length).toBe(1);
});

test('does not create an absent value if no tokens remain', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  valueMock = null;

  tokenList.remove('aaa');

  expect(valueMock).toBeNull();
});

test('splits tokens by ASCII whitespace only', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  valueMock = 'aaa\u00A0bbb\fccc';

  expect(tokenList.length).toBe(2);
  expect(tokenList.item(0)).toBe('aaa\u00A0bbb');
});

test('throws if a removed token contains whitespace, and removes nothing', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  tokenList.add('aaa', 'bbb');
  expect(() => tokenList.remove('aaa', 'b\tbb')).toThrow(
    "The token provided ('b	bb') contains HTML space characters, which are not valid in tokens"
  );

  expect(tokenList.value).toBe('aaa bbb');
});

test('removes duplicate tokens when the list is modified, but not when it is read', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  valueMock = 'aaa aaa bbb aaa';

  tokenList.contains('bbb');
  expect(tokenList.value).toBe('aaa aaa bbb aaa');

  tokenList.add('ccc');
  expect(tokenList.value).toBe('aaa bbb ccc');
});

describe('replace', () => {
  test('replaces a token', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(tokenList.replace('aaa', 'ccc')).toBe(true);
    expect(tokenList.value).toBe('ccc bbb');
    expect(tokenList.length).toBe(2);
  });

  test('returns false, and changes nothing, if the token is absent', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(tokenList.replace('ccc', 'eee')).toBe(false);
    expect(tokenList.value).toBe('aaa bbb');
    expect(tokenList.length).toBe(2);
  });

  test('removes the replaced token if the replacement is already present', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    valueMock = 'aaa bbb ccc';
    tokenList.replace('ccc', 'aaa');

    expect(tokenList.value).toBe('aaa bbb');

    valueMock = 'aaa bbb ccc';
    tokenList.replace('aaa', 'ccc');

    expect(tokenList.value).toBe('ccc bbb');
  });

  test('throws if the replaced token contains whitespace', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(() => tokenList.replace('a\taa', 'ccc')).toThrow(
      "The token provided ('a\taa') contains HTML space characters, which are not valid in tokens"
    );
  });

  test('throws if the replacement token contains whitespace, and replaces nothing', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(() => tokenList.replace('aaa', 'c\tcc')).toThrow(
      "The token provided ('c\tcc') contains HTML space characters, which are not valid in tokens"
    );
    expect(tokenList.value).toBe('aaa bbb');
  });

  test('replaces a token with itself', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    valueMock = 'aaa bbb';

    expect(tokenList.replace('aaa', 'aaa')).toBe(true);
    expect(tokenList.value).toBe('aaa bbb');
  });
});

describe('toggle', () => {
  test('adds a token if it is absent', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(tokenList.toggle('ccc')).toBe(true);
    expect(tokenList.value).toBe('aaa bbb ccc');
  });

  test('removes a token if it is present', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(tokenList.toggle('aaa')).toBe(false);
    expect(tokenList.value).toBe('bbb');
  });

  test('adds a token, or keeps it, if forced on', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(tokenList.toggle('aaa', true)).toBe(true);
    expect(tokenList.toggle('ccc', true)).toBe(true);
    expect(tokenList.value).toBe('aaa bbb ccc');
  });

  test('removes a token, or keeps it absent, if forced off', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(tokenList.toggle('aaa', false)).toBe(false);
    expect(tokenList.toggle('ccc', false)).toBe(false);
    expect(tokenList.value).toBe('bbb');
  });
});

describe('contains', () => {
  test('returns whether a token is in the list', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(tokenList.contains('aaa')).toBe(true);
    expect(tokenList.contains('ccc')).toBe(false);
  });
});

describe('item', () => {
  test('returns a token by index, or null if the index is out of range or not an integer', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    valueMock = 'aaa   bbb\t\tccc';

    expect(tokenList.item(0)).toBe('aaa');
    expect(tokenList.item(1)).toBe('bbb');
    expect(tokenList.item(2)).toBe('ccc');
    expect(tokenList.item(3)).toBeNull();
    expect(tokenList.item(0.5)).toBeNull();
  });
});

describe('forEach', () => {
  test('calls the callback with each token, its index and the list', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);
    const callbackMock = vi.fn();
    const thisArg = {};

    valueMock = 'aaa bbb';
    tokenList.forEach(callbackMock, thisArg);

    expect(callbackMock).toHaveBeenCalledTimes(2);
    expect(callbackMock).toHaveBeenNthCalledWith(1, 'aaa', 0, tokenList);
    expect(callbackMock).toHaveBeenNthCalledWith(2, 'bbb', 1, tokenList);
    expect(callbackMock.mock.contexts[0]).toBe(thisArg);
  });
});

describe('Symbol.iterator', () => {
  test('yields tokens', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    valueMock = 'aaa bbb';

    expect(Array.from(tokenList)).toEqual(['aaa', 'bbb']);
  });
});

describe('toString', () => {
  test('returns the underlying value', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    valueMock = 'aaa   bbb\t\tccc';

    expect(tokenList.toString()).toBe('aaa   bbb\t\tccc');
  });
});
