import { Constructor, isEqualConstructor } from './utils';
import { Node } from './Node';
import { ChildNode, extendChildNode } from './ChildNode';

export interface CharacterData extends ChildNode {}

/**
 * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData CharacterData} on MDN
 */
export abstract class CharacterData extends Node {
  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/data CharacterData.data} on MDN
   */
  data: string;

  get nodeValue(): string | null {
    return this.data;
  }

  set nodeValue(value: string | null) {
    this.data = value === null || value === undefined ? '' : value;
  }

  get textContent(): string | null {
    return this.data;
  }

  set textContent(value: string | null) {
    this.data = value === null || value === undefined ? '' : value;
  }

  /**
   * Creates a new instance of {@link CharacterData}.
   */
  constructor(data = '') {
    super();
    this.data = data;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/length CharacterData.length} on MDN
   */
  get length(): number {
    return this.data.length;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/appendData CharacterData.appendData} on MDN
   */
  appendData(data: string): this {
    this.data += data;
    return this;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/deleteData CharacterData.deleteData} on MDN
   */
  deleteData(offset: number, count: number): this {
    this.data = this.data.substring(0, offset) + this.data.substring(offset + count);
    return this;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/insertData CharacterData.insertData} on MDN
   */
  insertData(offset: number, data: string): this {
    this.data = this.data.substring(0, offset) + data + this.data.substring(offset);
    return this;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/replaceData CharacterData.replaceData} on MDN
   */
  replaceData(offset: number, count: number, data: string): this {
    this.data = this.data.substring(0, offset) + data + this.data.substring(offset + count);
    return this;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/substringData CharacterData.substringData} on MDN
   */
  substringData(offset: number, count: number): string {
    return this.data.substring(offset, offset + count);
  }

  isEqualNode(otherNode: Node | null | undefined): boolean {
    return isEqualConstructor(this, otherNode) && otherNode.data === this.data;
  }

  cloneNode(deep?: boolean): CharacterData {
    const node = new (this.constructor as Constructor)();
    node.data = this.data;
    return node;
  }
}

extendChildNode(CharacterData);
