import { ChildNode } from './ChildNode.js';
import { DOMTokenList, type ValueAccessor } from './DOMTokenList.js';
import type { Node } from './Node.js';
import { ParentNode } from './ParentNode.js';
import { getTextContent, setTextContent, Text } from './Text.js';
import { uncheckedCloneChildren } from './uncheckedCloneChildren.js';
import { coerceToString, defineNodeType, ELEMENT_NODE, isEqualChildNodes, isEqualConstructor } from './utils.js';

/**
 * The position is case-insensitive.
 *
 * @group Other
 */
export type InsertPosition =
  | 'beforebegin'
  | 'afterbegin'
  | 'beforeend'
  | 'afterend'
  | 'beforeBegin'
  | 'afterBegin'
  | 'beforeEnd'
  | 'afterEnd';

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @see [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) on MDN
 * @group Nodes
 */
export class Element extends ParentNode(ChildNode()) {
  /**
   * Backs {@link classList}. Initialized on construction, so creating the list later doesn't change the hidden class of
   * the element.
   */
  private _classList: DOMTokenList | undefined = undefined;

  /**
   * @see [Element.id](https://developer.mozilla.org/en-US/docs/Web/API/Element/id) on MDN
   */
  get id(): string {
    return this.attributes.id ?? '';
  }

  set id(value: string) {
    this.attributes.id = coerceToString(value);
  }

  /**
   * @see [Element.className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) on MDN
   */
  get className(): string {
    return this.attributes.class ?? '';
  }

  set className(value: string) {
    this.attributes.class = coerceToString(value);
  }

  /**
   * @see [Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) on MDN
   */
  get classList(): DOMTokenList {
    if (this._classList === undefined) {
      this._classList = new DOMTokenList(new ClassAttributeAccessor(this));
    }
    return this._classList;
  }

  get textContent(): string | null {
    return getTextContent(this);
  }

  set textContent(value: string | null | undefined) {
    setTextContent(this, value);
  }

  /**
   * Creates a new instance of {@link Element}.
   *
   * @param tagName The tag name of the element.
   * @param attributes The attributes of the element. The object isn't copied, to avoid an allocation per element, so
   * the element owns it, and it must not be passed to other elements.
   */
  constructor(
    /**
     * @see [Element.tagName](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName) on MDN
     */
    readonly tagName: string,
    /**
     * @see [Element.attributes](https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) on MDN
     */
    readonly attributes: Record<string, string> = {}
  ) {
    super();
  }

  /**
   * @param name The name of the attribute.
   * @param value The value of the attribute. `null` and `undefined` become an empty string, and other values are
   * stringified.
   * @see [Element.setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute) on MDN
   */
  setAttribute(name: string, value: string | null | undefined): this {
    value = coerceToString(value);

    if (name === '__proto__') {
      // Assignment would call the inherited __proto__ setter, which ignores strings, so define an own property instead
      Object.defineProperty(this.attributes, name, { value, writable: true, enumerable: true, configurable: true });
    } else {
      this.attributes[name] = value;
    }
    return this;
  }

  /**
   * @see [Element.getAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute) on MDN
   */
  getAttribute(name: string): string | null {
    // Own property check, so inherited Object.prototype members aren't reported as attributes
    return hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
  }

  /**
   * @see [Element.hasAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute) on MDN
   */
  hasAttribute(name: string): boolean {
    return hasOwnProperty.call(this.attributes, name);
  }

  /**
   * @see [Element.removeAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute) on MDN
   */
  removeAttribute(name: string): this {
    delete this.attributes[name];
    return this;
  }

  /**
   * @see [Element.toggleAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute) on MDN
   */
  toggleAttribute(name: string, force?: boolean): boolean {
    const value = this.getAttribute(name);
    const exists = value !== null;

    if (!exists && (force === undefined || force)) {
      this.setAttribute(name, '');
      return true;
    }

    if (exists && (force === undefined || !force)) {
      this.removeAttribute(name);
      return false;
    }

    return exists;
  }

  /**
   * @see [Element.getAttributeNames](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames) on MDN
   */
  getAttributeNames(): string[] {
    return Object.keys(this.attributes);
  }

  /**
   * @see [Element.insertAdjacentElement](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement) on MDN
   */
  insertAdjacentElement(position: InsertPosition, element: Element): Element | null {
    return insertAdjacentNode(this, position, element);
  }

  /**
   * @see [Element.insertAdjacentText](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentText) on MDN
   */
  insertAdjacentText(position: InsertPosition, data: string): void {
    if (data !== null && data !== undefined) {
      insertAdjacentNode(this, position, new Text(data));
    }
  }

  isEqualNode(otherNode: Node | null | undefined): boolean {
    return (
      isEqualConstructor(this, otherNode) &&
      this.tagName === otherNode.tagName &&
      isEqualAttributes(this.attributes, otherNode.attributes) &&
      isEqualChildNodes(this, otherNode)
    );
  }

  cloneNode(deep?: boolean): Element {
    // The constructor doesn't copy attributes, so the clone would share them otherwise
    const node = new (this.constructor as typeof Element)(this.tagName, { ...this.attributes });

    if (deep) {
      uncheckedCloneChildren(this, node);
    }
    return node;
  }
}

defineNodeType(Element, ELEMENT_NODE, element => element.tagName);

/**
 * Reads and writes the class attribute for {@link Element.classList}. A class takes less memory than an object with
 * two closures that capture the element.
 */
class ClassAttributeAccessor implements ValueAccessor {
  constructor(private readonly element: Element) {}

  get(): string | null {
    return this.element.getAttribute('class');
  }

  set(value: string): void {
    this.element.attributes.class = value;
  }
}

function isEqualAttributes(attrs: Record<string, string>, otherAttrs: Record<string, string>): boolean {
  let attrsCount = 0;

  for (const key in attrs) {
    ++attrsCount;

    if (attrs[key] !== otherAttrs[key]) {
      return false;
    }
  }

  return attrsCount === Object.keys(otherAttrs).length;
}

function insertAdjacentNode<T extends Node>(element: Element, position: InsertPosition, node: T): T | null {
  switch (position.toLowerCase()) {
    case 'beforebegin':
      if (element.parentNode === null) {
        return null;
      }
      element.before(node);
      break;

    case 'afterbegin':
      element.prepend(node);
      break;

    case 'beforeend':
      element.append(node);
      break;

    case 'afterend':
      if (element.parentNode === null) {
        return null;
      }
      element.after(node);
      break;

    default:
      throw new Error(
        "The value provided ('" + position + "') is not one of 'beforeBegin', 'afterBegin', 'beforeEnd', or 'afterEnd'"
      );
  }

  return node;
}
