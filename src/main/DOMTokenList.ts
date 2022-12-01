import { die } from './utils';

const SEPARATOR = /s+/;
const JOINER = ' ';

interface ValueAccessor {
  get(): string;

  set(value: string): void;
}

export function createDOMTokenList(valueAccessor: ValueAccessor): DOMTokenList {
  const tokenList: DOMTokenList = Object.create(prototype);
  tokenList._valueAccessor = valueAccessor;
  return tokenList;
}

export interface DOMTokenList {
  readonly length: number;
  value: string;

  // private
  _valueAccessor: ValueAccessor;

  add(...tokens: string[]): void;

  contains(token: string): boolean;

  item(index: number): string | null;

  remove(...tokens: string[]): void;

  replace(oldToken: string, newToken: string): boolean;

  toggle(token: string, force?: boolean): boolean;

  forEach(callback: (value: string, index: number, parent: DOMTokenList) => void, thisArg?: any): void;
}

export class DOMTokenList {
  constructor() {
    die('Illegal constructor');
  }
}

const prototype = DOMTokenList.prototype;

prototype.add = function (/*...tokens: string[]*/) {
  const { _valueAccessor } = this;

  const tokensLength = arguments.length;
  const tokens = _valueAccessor.get().split(SEPARATOR);

  for (let i = 0; i < tokensLength; ++i) {
    const token = arguments[i];

    if (tokens.indexOf(token) === -1) {
      tokens.push(token);
    }
  }

  _valueAccessor.set(tokens.join(JOINER));
};

prototype.contains = function (token) {
  return this._valueAccessor.get().split(SEPARATOR).indexOf(token) !== -1;
};

prototype.item = function (index) {
  return this._valueAccessor.get().split(SEPARATOR)[index] || null;
};

prototype.remove = function (/*...tokens: string[]*/) {
  const { _valueAccessor } = this;

  const tokensLength = arguments.length;
  const tokens = _valueAccessor.get().split(SEPARATOR);

  for (let i = 0; i < tokensLength; ++i) {
    const index = tokens.indexOf(arguments[i]);

    if (index !== -1) {
      tokens.splice(index, 1);
    }
  }

  _valueAccessor.set(tokens.join(JOINER));
};

prototype.replace = function (oldToken, newToken) {
  const { _valueAccessor } = this;

  const tokens = _valueAccessor.get().split(SEPARATOR);
  const index = tokens.indexOf(oldToken);

  if (index !== -1) {
    tokens[index] = newToken;
    _valueAccessor.set(tokens.join(JOINER));
    return true;
  }

  return false;
};

prototype.toggle = function (token, force) {
  const { _valueAccessor } = this;

  const tokens = _valueAccessor.get().split(SEPARATOR);
  const index = tokens.indexOf(token);
  const exists = index !== -1;

  if (!exists && (force === undefined || force)) {
    tokens.push(token);
    _valueAccessor.set(tokens.join(JOINER));
    return true;
  }

  if (exists && (force === undefined || !force)) {
    tokens.splice(index, 1);
    _valueAccessor.set(tokens.join(JOINER));
    return false;
  }

  return exists;
};

prototype.forEach = function (callback, thisArg) {
  const tokens = this._valueAccessor.get().split(SEPARATOR);

  for (let i = 0; i < tokens.length; ++i) {
    callback.call(thisArg, tokens[i], i, this);
  }
};

prototype.toString = function () {
  return this.value;
};
