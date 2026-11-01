import { ChildNode } from './ChildNode.js';
import type { Node } from './Node.js';
import { coerceToNonNegativeInteger, coerceToString, isEqualConstructor } from './utils.js';

/**
 * @see [CharacterData](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData) on MDN
 * @group Nodes
 */
export abstract class CharacterData extends ChildNode() {
  get nodeValue(): string | null {
    return this.data;
  }

  set nodeValue(value: string | null | undefined) {
    this.data = coerceToString(value);
  }

  get textContent(): string | null {
    return this.data;
  }

  set textContent(value: string | null | undefined) {
    this.data = coerceToString(value);
  }

  /**
   * @see [CharacterData.data](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/data) on MDN
   */
  data: string;

  /**
   * Creates a new instance of {@link CharacterData}.
   *
   * @param data The data of the node. `null` and `undefined` become an empty string, and other values are stringified.
   */
  constructor(data?: null | string) {
    super();
    this.data = coerceToString(data);
  }

  /**
   * @see [CharacterData.length](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/length) on MDN
   */
  get length(): number {
    return this.data.length;
  }

  /**
   * @see [CharacterData.appendData](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/appendData) on MDN
   */
  appendData(data: string): this {
    this.data += coerceToString(data);
    return this;
  }

  /**
   * @see [CharacterData.deleteData](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/deleteData) on MDN
   */
  deleteData(offset: number, count: number): this {
    offset = coerceToNonNegativeInteger(offset);

    this.data = this.data.substring(0, offset) + this.data.substring(offset + coerceToNonNegativeInteger(count));
    return this;
  }

  /**
   * @see [CharacterData.insertData](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/insertData) on MDN
   */
  insertData(offset: number, data: string): this {
    offset = coerceToNonNegativeInteger(offset);

    this.data = this.data.substring(0, offset) + coerceToString(data) + this.data.substring(offset);
    return this;
  }

  /**
   * @see [CharacterData.replaceData](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/replaceData) on MDN
   */
  replaceData(offset: number, count: number, data: string): this {
    offset = coerceToNonNegativeInteger(offset);

    this.data =
      this.data.substring(0, offset) +
      coerceToString(data) +
      this.data.substring(offset + coerceToNonNegativeInteger(count));

    return this;
  }

  /**
   * @see [CharacterData.substringData](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/substringData) on MDN
   */
  substringData(offset: number, count: number): string {
    offset = coerceToNonNegativeInteger(offset);

    return this.data.substring(offset, offset + coerceToNonNegativeInteger(count));
  }

  isEqualNode(otherNode: Node | null | undefined): boolean {
    return isEqualConstructor<CharacterData>(this, otherNode) && otherNode.data === this.data;
  }

  cloneNode(deep?: boolean): CharacterData {
    const node = new (this.constructor as new () => CharacterData)();
    node.data = this.data;
    return node;
  }
}
