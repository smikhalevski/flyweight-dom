import type { DocumentFragment } from './DocumentFragment.ts';
import type { Element } from './Element.ts';
import type { Node } from './Node.ts';
import type { Text } from './Text.ts';

export const ELEMENT_NODE = 1;
export const ATTRIBUTE_NODE = 2;
export const TEXT_NODE = 3;
export const CDATA_SECTION_NODE = 4;
export const PROCESSING_INSTRUCTION_NODE = 7;
export const COMMENT_NODE = 8;
export const DOCUMENT_NODE = 9;
export const DOCUMENT_TYPE_NODE = 10;
export const DOCUMENT_FRAGMENT_NODE = 11;

/**
 * The namespace that the `xml` prefix is always bound to.
 *
 * @group Other
 */
export const XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

/**
 * The namespace of `xmlns` and `xmlns:*` attributes.
 *
 * @group Other
 */
export const XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/';

const retainedInstances: object[] = [];

/**
 * Keeps instances alive while the module is loaded, one per class.
 *
 * A major garbage collection that finds no instance of a class drops its hidden class, which discards optimized code
 * that inlines methods or constructors of the class, so the next few calls are slow. A kept instance keeps the hidden
 * class.
 */
export const retainHiddenClasses = (...instances: object[]): void => {
  retainedInstances.push(...instances);
};

/**
 * The prototype of built-in iterators, which adds helpers like map() and toArray() in newer runtimes. Set it as the
 * prototype of a custom iterator class, so its instances get the helpers too.
 */
export const iteratorPrototype: object = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));

const objectHasOwnProperty = Object.prototype.hasOwnProperty;

export const hasOwnProperty = (object: object, key: PropertyKey): boolean => {
  return objectHasOwnProperty.call(object, key);
};

/**
 * Defines {@link Node.nodeType} and {@link Node.nodeName} on the prototype of a node class, so nodes don't spend memory
 * on values that are the same for all instances of a class, or that duplicate another property.
 *
 * Both properties stay assignable, so subclasses that declare them as fields keep working.
 *
 * @param constructor The node class.
 * @param nodeType The node type of class instances.
 * @param nodeName The node name of class instances, or a callback that derives it from a node.
 * @template TNode The node class instance.
 */
export const defineNodeType = <TNode extends Node>(
  constructor: { prototype: TNode },
  nodeType: number,
  nodeName: string | ((node: TNode) => string)
): void => {
  const { prototype } = constructor;

  Object.defineProperty(prototype, 'nodeType', { value: nodeType, writable: true, configurable: true });

  if (typeof nodeName === 'string') {
    Object.defineProperty(prototype, 'nodeName', { value: nodeName, writable: true, configurable: true });
    return;
  }

  Object.defineProperty(prototype, 'nodeName', {
    configurable: true,

    get(this: TNode) {
      return nodeName(this);
    },

    set(this: TNode, value: string) {
      // Same as an own field would be
      Object.defineProperty(this, 'nodeName', { value, writable: true, enumerable: true, configurable: true });
    },
  });
};

export const isElement = (node: Node): node is Element => {
  return node.nodeType === ELEMENT_NODE;
};

export const isDocumentFragment = (node: Node): node is DocumentFragment => {
  return node.nodeType === DOCUMENT_FRAGMENT_NODE;
};

export const getPreviousSiblingOrSelf = (node: Node | null, nodeType: number): Node | null => {
  while (node !== null && node.nodeType !== nodeType) {
    node = node.previousSibling;
  }
  return node;
};

export const getNextSiblingOrSelf = (node: Node | null, nodeType: number): Node | null => {
  while (node !== null && node.nodeType !== nodeType) {
    node = node.nextSibling;
  }
  return node;
};

export const isText = (node: Node): node is Text => {
  return node.nodeType === TEXT_NODE || node.nodeType === CDATA_SECTION_NODE;
};

/**
 * Truncates the value to an integer, or returns 0 if the value is negative or NaN.
 */
export const coerceToNonNegativeInteger = (value: number): number => {
  return value > 0 ? Math.trunc(value) : 0;
};

export const coerceToString = (value: unknown): string => {
  return typeof value === 'string' ? value : value === null || value === undefined ? '' : String(value);
};

// https://infra.spec.whatwg.org/#ascii-whitespace
export const isSpaceChar = (charCode: number): boolean => {
  return (
    charCode === /* \s */ 32 ||
    charCode === /* \n */ 10 ||
    charCode === /* \t */ 9 ||
    charCode === /* \r */ 13 ||
    charCode === /* \f */ 12
  );
};

export const isEqualConstructor = <T extends Node>(node: T, otherNode: Node | null | undefined): otherNode is T => {
  return otherNode !== null && otherNode !== undefined && otherNode.constructor === node.constructor;
};

export const isEqualChildNodes = (node: Node, otherNode: Node): boolean => {
  let child = node.firstChild;
  let otherChild = otherNode.firstChild;

  while (child !== null && otherChild !== null && child.isEqualNode(otherChild)) {
    child = child.nextSibling;
    otherChild = otherChild.nextSibling;
  }

  return child === null && otherChild === null;
};
