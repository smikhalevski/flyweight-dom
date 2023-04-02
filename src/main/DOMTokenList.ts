import { die, isSpaceChar } from './utils';

const separatorRegex = /\s+/;
const separator = ' ';

export interface ValueAccessor {
  get(): string;

  set(value: string): void;
}

export interface DOMTokenList {
  length: number;
  value: string;

  _tokens: string[];

  add(...tokens: string[]): void;

  remove(...tokens: string[]): void;

  replace(replacedToken: string, token: string): boolean;

  toggle(token: string, force?: boolean): boolean;

  contains(token: string): boolean;

  item(index: number): string | null;

  forEach(callback: (value: string, index: number, parent: DOMTokenList) => void, thisArg?: any): void;
}

export class DOMTokenList {
  _tokenizedValue: string | undefined;

  constructor(public _valueAccessor: ValueAccessor) {}
}

const prototype = DOMTokenList.prototype;

Object.defineProperties(prototype, {
  length: {
    get(this: DOMTokenList) {
      return getTokens(this).length;
    },
  },

  value: {
    get(this: DOMTokenList) {
      return this._valueAccessor.get();
    },
    set(this: DOMTokenList, value) {
      this._valueAccessor.set(value);
    },
  },
});

prototype.add = function (/*...tokens: string[]*/) {
  const argumentsLength = arguments.length;

  for (let i = 0; i < argumentsLength; ++i) {
    assertToken(arguments[i]);
  }

  const tokens = getTokens(this);

  for (let i = 0; i < argumentsLength; ++i) {
    const token = arguments[i];

    if (tokens.indexOf(token) === -1) {
      tokens.push(token);
    }
  }

  setTokens(this, tokens);
};

prototype.remove = function (/*...tokens: string[]*/) {
  const argumentsLength = arguments.length;

  for (let i = 0; i < argumentsLength; ++i) {
    assertToken(arguments[i]);
  }

  const tokens = getTokens(this);

  for (let i = 0; i < argumentsLength; ++i) {
    const index = tokens.indexOf(arguments[i]);

    if (index !== -1) {
      tokens.splice(index, 1);
    }
  }

  setTokens(this, tokens);
};

prototype.replace = function (replacedToken, token) {
  assertToken(replacedToken);
  assertToken(token);

  const tokens = getTokens(this);
  const index = tokens.indexOf(replacedToken);

  if (index === -1) {
    return false;
  }

  tokens.splice(index, 1, token);
  setTokens(this, tokens);
  return true;
};

prototype.toggle = function (token, force) {
  assertToken(token);

  const tokens = getTokens(this);
  const index = tokens.indexOf(token);
  const exists = index !== -1;

  if (!exists && (force === undefined || force)) {
    tokens.push(token);
    setTokens(this, tokens);
    return true;
  }

  if (exists && (force === undefined || !force)) {
    tokens.splice(index, 1);
    setTokens(this, tokens);
    return false;
  }

  return exists;
};

prototype.contains = function (token) {
  return getTokens(this).indexOf(token) !== -1;
};

prototype.item = function (index) {
  const tokens = getTokens(this);
  return index < 0 || index >= tokens.length ? null : tokens[index] || null;
};

prototype.forEach = function (callback, thisArg) {
  const tokens = getTokens(this);

  for (let i = 0; i < tokens.length; ++i) {
    callback.call(thisArg, tokens[i], i, this);
  }
};

prototype.toString = function () {
  return this._valueAccessor.get();
};

function getTokens(tokenList: DOMTokenList): string[] {
  let value = tokenList._valueAccessor.get();

  if (value === tokenList._tokenizedValue) {
    return tokenList._tokens;
  }

  value = value.trim();

  const tokens = value.length === 0 ? [] : value.split(separatorRegex);

  // Make unique
  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i];

    for (let j = tokens.indexOf(token, i + 1); j !== -1; j = tokens.indexOf(token, j)) {
      tokens.splice(j, 1);
    }
  }

  tokenList._tokenizedValue = value;
  tokenList._tokens = tokens;

  return tokens;
}

function setTokens(tokenList: DOMTokenList, tokens: string[]): void {
  const value = tokens.join(separator);

  tokenList._valueAccessor.set(value);
  tokenList._tokenizedValue = value;
  tokenList._tokens = tokens;
}

function assertToken(token: string): void {
  const tokenLength = token.length;

  if (tokenLength === 0) {
    die('The token provided must not be empty');
  }
  for (let i = 0; i < tokenLength; ++i) {
    if (isSpaceChar(token.charCodeAt(i))) {
      die("The token provided ('" + token + "') contains HTML space characters, which are not valid in tokens");
    }
  }
}
