import { isSpaceChar } from './utils.js';

const SEPARATOR = ' ';

/**
 * @group Other
 */
export interface ValueAccessor {
  /**
   * Returns the value, or `null` if it is absent. An absent value isn't created when the token list stays empty.
   */
  get(): string | null;

  set(value: string): void;
}

/**
 * @see [DOMTokenList](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList) on MDN
 * @group Nodes
 */
export class DOMTokenList {
  /**
   * @see [DOMTokenList.length](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/length) on MDN
   */
  get length(): number {
    return getTokens(this).length;
  }

  /**
   * @see [DOMTokenList.value](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/value) on MDN
   */
  get value(): string {
    return this._valueAccessor.get() ?? '';
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
   * @see [DOMTokenList.add](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/add) on MDN
   */
  add(...tokens: string[]): void;

  add(): void {
    for (let i = 0; i < arguments.length; ++i) {
      assertToken(arguments[i]);
    }

    const tokens = getTokens(this);

    for (let i = 0; i < arguments.length; ++i) {
      const token = arguments[i];

      if (tokens.indexOf(token) === -1) {
        tokens.push(token);
      }
    }

    setTokens(this, tokens);
  }

  /**
   * @see [DOMTokenList.remove](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/remove) on MDN
   */
  remove(...tokens: string[]): void;

  remove(): void {
    for (let i = 0; i < arguments.length; ++i) {
      assertToken(arguments[i]);
    }

    const tokens = getTokens(this);

    for (let i = 0; i < arguments.length; ++i) {
      const index = tokens.indexOf(arguments[i]);

      if (index !== -1) {
        tokens.splice(index, 1);
      }
    }

    setTokens(this, tokens);
  }

  /**
   * @see [DOMTokenList.replace](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace) on MDN
   */
  replace(replacedToken: string, token: string): boolean {
    assertToken(replacedToken);
    assertToken(token);

    const tokens = getTokens(this);
    const index = tokens.indexOf(replacedToken);

    if (index === -1) {
      return false;
    }

    const tokenIndex = tokens.indexOf(token);

    if (tokenIndex === -1) {
      tokens[index] = token;
    } else if (tokenIndex !== index) {
      // The token is already present, so keep it at whichever position comes first
      tokens[Math.min(index, tokenIndex)] = token;
      tokens.splice(Math.max(index, tokenIndex), 1);
    }

    setTokens(this, tokens);
    return true;
  }

  /**
   * @see [DOMTokenList.toggle](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle) on MDN
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
   * @see [DOMTokenList.contains](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/contains) on MDN
   */
  contains(token: string): boolean {
    return getTokens(this).indexOf(token) !== -1;
  }

  /**
   * @see [DOMTokenList.item](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/item) on MDN
   */
  item(index: number): string | null {
    const tokens = getTokens(this);
    return index < 0 || index >= tokens.length ? null : tokens[index] ?? null;
  }

  /**
   * @see [DOMTokenList.forEach](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/forEach) on MDN
   */
  forEach(callback: (value: string, index: number, parent: DOMTokenList) => void, thisArg?: any): void {
    const tokens = getTokens(this);

    for (let i = 0; i < tokens.length; ++i) {
      callback.call(thisArg, tokens[i], i, this);
    }
  }

  /**
   * @see [DOMTokenList.values](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/values) on MDN
   */
  values(): IterableIterator<string> {
    return getTokens(this).values();
  }

  [Symbol.iterator](): IterableIterator<string> {
    return this.values();
  }

  /**
   * @hidden
   */
  toString() {
    return this.value;
  }
}

/**
 * Splits the value into unique tokens separated by ASCII whitespace.
 */
export function splitTokens(value: string): string[] {
  const tokens: string[] = [];

  let tokenStartIndex = 0;

  for (let i = 0; i <= value.length; ++i) {
    if (i < value.length && !isSpaceChar(value.charCodeAt(i))) {
      continue;
    }

    if (tokenStartIndex < i) {
      const token = value.substring(tokenStartIndex, i);

      if (tokens.indexOf(token) === -1) {
        tokens.push(token);
      }
    }

    tokenStartIndex = i + 1;
  }

  return tokens;
}

function getTokens(tokenList: DOMTokenList): string[] {
  const value = tokenList.value;

  if (value === tokenList['_tokenizedValue'] && tokenList['_tokens'] !== undefined) {
    return tokenList['_tokens'];
  }

  const tokens = splitTokens(value);

  tokenList['_tokenizedValue'] = value;
  tokenList['_tokens'] = tokens;

  return tokens;
}

function setTokens(tokenList: DOMTokenList, tokens: string[]): void {
  const valueAccessor = tokenList['_valueAccessor'];

  // https://dom.spec.whatwg.org/#concept-dtl-update
  if (tokens.length === 0 && valueAccessor.get() === null) {
    return;
  }

  const value = tokens.join(SEPARATOR);

  valueAccessor.set(value);
  tokenList['_tokenizedValue'] = value;
  tokenList['_tokens'] = tokens;
}

function assertToken(token: string): void {
  if (token.length === 0) {
    throw new Error('The token provided must not be empty');
  }

  for (let i = 0; i < token.length; ++i) {
    if (isSpaceChar(token.charCodeAt(i))) {
      throw new Error(
        "The token provided ('" + token + "') contains HTML space characters, which are not valid in tokens"
      );
    }
  }
}
