/**
 * The core DOM nodes implementation.
 *
 * ```ts
 * import { Element } from 'flyweight-dom';
 *
 * const element = new Element('div').append(
 *   'Hello, ',
 *   new Element('strong').append('world!')
 * );
 *
 * element.classList.add('red');
 *
 * element.getAttribute('class');
 * // ⮕ 'red'
 * ```
 *
 * @module flyweight-dom
 */

export { Node } from './Node.ts';
export { CDATASection } from './CDATASection.ts';
export { CharacterData } from './CharacterData.ts';
export { ChildNode } from './ChildNode.ts';
export { Comment } from './Comment.ts';
export { Document } from './Document.ts';
export { DocumentFragment } from './DocumentFragment.ts';
export { DocumentType } from './DocumentType.ts';
export { DOMTokenList, type ValueAccessor } from './DOMTokenList.ts';
export { Element, type InsertPosition } from './Element.ts';
export { NodeFilter } from './NodeFilter.ts';
export { NodeList, EmptyNodeList, ChildNodeList } from './NodeList.ts';
export { ParentNode } from './ParentNode.ts';
export { ProcessingInstruction } from './ProcessingInstruction.ts';
export { Text } from './Text.ts';
export { TreeWalker } from './TreeWalker.ts';
export { XML_NAMESPACE, XMLNS_NAMESPACE } from './utils.ts';
