import { beforeEach, describe, expect, test } from 'vitest';
import { DOMTokenList, ValueAccessor } from '../main/index.js';

let valueMock = '';

const valueAccessorMock: ValueAccessor = {
  get: () => valueMock,
  set: value => {
    valueMock = value;
  },
};

beforeEach(() => {
  valueMock = '';
});

test('creates a new DOMTokenList instance', () => {
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

test('adds a new token', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  tokenList.add('aaa', 'bbb');
  tokenList.add('ccc');

  expect(tokenList.value).toBe('aaa bbb ccc');
  expect(tokenList.length).toBe(3);
});

test('throws if an added token contains space chars', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  tokenList.add('ccc');
  expect(() => tokenList.add('aaa', 'b\tbb')).toThrow(
    new Error("The token provided ('b	bb') contains HTML space characters, which are not valid in tokens")
  );

  expect(tokenList.value).toBe('ccc');
});

test('removes a token', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  tokenList.add('aaa', 'bbb', 'ccc');
  tokenList.remove('aaa', 'ccc');

  expect(tokenList.value).toBe('bbb');
  expect(tokenList.length).toBe(1);
});

test('throws if a removed token contains space chars', () => {
  const tokenList = new DOMTokenList(valueAccessorMock);

  tokenList.add('aaa', 'bbb');
  expect(() => tokenList.remove('aaa', 'b\tbb')).toThrow(
    new Error("The token provided ('b	bb') contains HTML space characters, which are not valid in tokens")
  );

  expect(tokenList.value).toBe('aaa bbb');
});

test('tokens become unique after list is modified', () => {
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

  test('returns false if a token cannot be replaced', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(tokenList.replace('ccc', 'eee')).toBe(false);
    expect(tokenList.value).toBe('aaa bbb');
    expect(tokenList.length).toBe(2);
  });

  test('throws if a replaced token contains space chars', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(() => tokenList.replace('a\taa', 'ccc')).toThrow(
      new Error("The token provided ('a\taa') contains HTML space characters, which are not valid in tokens")
    );
  });

  test('throws if a replacement token contains space chars', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(() => tokenList.replace('aaa', 'c\tcc')).toThrow(
      new Error("The token provided ('c\tcc') contains HTML space characters, which are not valid in tokens")
    );
    expect(tokenList.value).toBe('aaa bbb');
  });
});

describe('add', () => {
  test('adds a token if it is not contained', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');
    tokenList.toggle('ccc');

    expect(tokenList.value).toBe('aaa bbb ccc');
  });

  test('removes a token if it is contained', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');
    tokenList.toggle('aaa');

    expect(tokenList.value).toBe('bbb');
  });

  test('adds a token or does nothing', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');
    tokenList.toggle('aaa', true);
    tokenList.toggle('ccc', true);

    expect(tokenList.value).toBe('aaa bbb ccc');
  });

  test('removes a token or does nothing', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');
    tokenList.toggle('aaa', false);
    tokenList.toggle('ccc', false);

    expect(tokenList.value).toBe('bbb');
  });

  test('returns true if a token is in the list', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    tokenList.add('aaa', 'bbb');

    expect(tokenList.contains('aaa')).toBe(true);
    expect(tokenList.contains('ccc')).toBe(false);
  });
});

describe('item', () => {
  test('returns a token by its index', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    valueMock = 'aaa   bbb\t\tccc';

    expect(tokenList.item(0)).toBe('aaa');
    expect(tokenList.item(1)).toBe('bbb');
    expect(tokenList.item(2)).toBe('ccc');
    expect(tokenList.item(3)).toBeNull();
    expect(tokenList.item(0.5)).toBeNull();
  });
});

describe('toString', () => {
  test('stringifies as an underlying value', () => {
    const tokenList = new DOMTokenList(valueAccessorMock);

    valueMock = 'aaa   bbb\t\tccc';

    expect(tokenList.toString()).toBe('aaa   bbb\t\tccc');
  });
});
