import { Node } from './Node.js';
import { getTextContent, isEqualChildNodes, isEqualConstructor, isSpaceChar, setTextContent } from './utils.js';
import { ChildNode } from './ChildNode.js';
import { ParentNode } from './ParentNode.js';
import { uncheckedCloneChildren } from './uncheckedCloneChildren.js';
import { DOMTokenList } from './DOMTokenList.js';
import { Text } from './Text.js';

/**
 * @group Other
 */
export type InsertPosition = 'beforeBegin' | 'afterBegin' | 'beforeEnd' | 'afterEnd';

/**
 * @see [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) on MDN
 * @group Nodes
 */
export class Element extends ParentNode(ChildNode()) {
  readonly nodeType: number = Node.ELEMENT_NODE;
  readonly nodeName: string;

  /**
   * @see [Element.id](https://developer.mozilla.org/en-US/docs/Web/API/Element/id) on MDN
   */
  get id(): string {
    return this.attributes.id || '';
  }

  set id(value: string) {
    this.attributes.id = value;
  }

  /**
   * @see [Element.className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) on MDN
   */
  get className(): string {
    return this.attributes.class || '';
  }

  set className(value: string) {
    this.attributes.class = value;
  }

  /**
   * @see [Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) on MDN
   */
  get classList(): DOMTokenList {
    const tokenList = new DOMTokenList({
      get: () => {
        return this.attributes.class || '';
      },
      set: value => {
        this.attributes.class = value;
      },
    });

    return Object.defineProperty(this, 'classList', { value: tokenList }).classList;
  }

  get textContent(): string | null {
    return getTextContent(this);
  }

  set textContent(value: string | null) {
    setTextContent(this, value);
  }

  /**
   * Creates a new instance of {@link Element}.
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
    this.nodeName = tagName;
  }

  /**
   * @see [Element.setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute) on MDN
   */
  setAttribute(name: string, value: string): this {
    this.attributes[name] = value;
    return this;
  }

  /**
   * @see [Element.getAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute) on MDN
   */
  getAttribute(name: string): string | null {
    return this.attributes[name] ?? null;
  }

  /**
   * @see [Element.hasAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute) on MDN
   */
  hasAttribute(name: string): boolean {
    return this.attributes[name] !== undefined;
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
    for (let i = 0; i < data.length; ++i) {
      if (!isSpaceChar(data.charCodeAt(i))) {
        insertAdjacentNode(this, position, new Text(data));
        break;
      }
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
    const node = new Element(this.tagName);

    if (deep) {
      uncheckedCloneChildren(this, node);
    }
    return node;
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
  switch (position) {
    case 'beforeBegin':
      if (element.parentNode === null) {
        return null;
      }
      element.before(node);
      break;

    case 'afterBegin':
      element.prepend(node);
      break;

    case 'beforeEnd':
      element.append(node);
      break;

    case 'afterEnd':
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
