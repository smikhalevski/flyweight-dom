import { ChildNode } from './ChildNode.js';
import type { Node } from './Node.js';
import { assertOffset, isEqualConstructor, toUnsignedLong } from './utils.js';

/**
 * @see [CharacterData](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData) on MDN
 * @group Nodes
 */
export abstract class CharacterData extends ChildNode() {
  get nodeValue(): string | null {
    return this.data;
  }

  set nodeValue(value: string | null) {
    this.data = value || '';
  }

  get textContent(): string | null {
    return this.data;
  }

  set textContent(value: string | null) {
    this.data = value || '';
  }

  /**
   * Creates a new instance of {@link CharacterData}.
   */
  constructor(
    /**
     * @see [CharacterData.data](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/data) on MDN
     */
    public data = ''
  ) {
    super();
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
    this.data += data;
    return this;
  }

  /**
   * @see [CharacterData.deleteData](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/deleteData) on MDN
   */
  deleteData(offset: number, count: number): this {
    assertOffset(this.data, offset);

    this.data = this.data.substring(0, offset) + this.data.substring(offset + toUnsignedLong(count));
    return this;
  }

  /**
   * @see [CharacterData.insertData](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/insertData) on MDN
   */
  insertData(offset: number, data: string): this {
    assertOffset(this.data, offset);

    this.data = this.data.substring(0, offset) + data + this.data.substring(offset);
    return this;
  }

  /**
   * @see [CharacterData.replaceData](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/replaceData) on MDN
   */
  replaceData(offset: number, count: number, data: string): this {
    assertOffset(this.data, offset);

    this.data = this.data.substring(0, offset) + data + this.data.substring(offset + toUnsignedLong(count));
    return this;
  }

  /**
   * @see [CharacterData.substringData](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/substringData) on MDN
   */
  substringData(offset: number, count: number): string {
    assertOffset(this.data, offset);

    return this.data.substring(offset, offset + toUnsignedLong(count));
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
