import { isSpaceChar } from './utils';

const SEPARATOR_REGEX = /\s+/;
const SEPARATOR = ' ';

export interface ValueAccessor {
  get(): string;

  set(value: string): void;
}

/**
 * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList DOMTokenList} on MDN
 */
export class DOMTokenList {
  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/length DOMTokenList.length} on MDN
   */
  get length(): number {
    return getTokens(this).length;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/value DOMTokenList.value} on MDN
   */
  get value(): string {
    return this._valueAccessor.get();
  }

  set value(value: string) {
    this._valueAccessor.set(value);
  }

  private _tokens: string[] | undefined = undefined;
  private _tokenizedValue: string | undefined = undefined;
  private _valueAccessor: ValueAccessor;

  /**
   * Creates a new instance of {@link DOMTokenList}.
   *
   * @param valueAccessor The accessor that reads and writes the class string to the element.
   */
  constructor(valueAccessor: ValueAccessor) {
    this._valueAccessor = valueAccessor;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/add DOMTokenList.add} on MDN
   */
  add(...tokens: string[]): void;

  add(): void {
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
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/remove DOMTokenList.remove} on MDN
   */
  remove(...tokens: string[]): void;

  remove(): void {
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
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace DOMTokenList.replace} on MDN
   */
  replace(replacedToken: string, token: string): boolean {
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
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle DOMTokenList.toggle} on MDN
   */
  toggle(token: string, force?: boolean): boolean {
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
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/contains DOMTokenList.contains} on MDN
   */
  contains(token: string): boolean {
    return getTokens(this).indexOf(token) !== -1;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/item DOMTokenList.item} on MDN
   */
  item(index: number): string | null {
    const tokens = getTokens(this);
    return index < 0 || index >= tokens.length ? null : tokens[index] || null;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/forEach DOMTokenList.forEach} on MDN
   */
  forEach(callback: (value: string, index: number, parent: DOMTokenList) => void, thisArg?: any): void {
    const tokens = getTokens(this);

    for (let i = 0; i < tokens.length; ++i) {
      callback.call(thisArg, tokens[i], i, this);
    }
  }

  /**
   * @hidden
   */
  toString() {
    return this._valueAccessor.get();
  }
}

function getTokens(tokenList: DOMTokenList): string[] {
  let value = tokenList['_valueAccessor'].get();

  if (value === tokenList['_tokenizedValue'] && tokenList['_tokens'] !== undefined) {
    return tokenList['_tokens'];
  }

  value = value.trim();

  const tokens = value.length === 0 ? [] : value.split(SEPARATOR_REGEX);

  // Make unique
  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i];

    for (let j = tokens.indexOf(token, i + 1); j !== -1; j = tokens.indexOf(token, j)) {
      tokens.splice(j, 1);
    }
  }

  tokenList['_tokenizedValue'] = value;
  tokenList['_tokens'] = tokens;

  return tokens;
}

function setTokens(tokenList: DOMTokenList, tokens: string[]): void {
  const value = tokens.join(SEPARATOR);

  tokenList['_valueAccessor'].set(value);
  tokenList['_tokenizedValue'] = value;
  tokenList['_tokens'] = tokens;
}

function assertToken(token: string): void {
  const tokenLength = token.length;

  if (tokenLength === 0) {
    throw new Error('The token provided must not be empty');
  }
  for (let i = 0; i < tokenLength; ++i) {
    if (isSpaceChar(token.charCodeAt(i))) {
      throw new Error(
        "The token provided ('" + token + "') contains HTML space characters, which are not valid in tokens"
      );
    }
  }
}
