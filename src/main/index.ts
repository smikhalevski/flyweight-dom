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

export { Node } from './Node.js';
export { CDATASection } from './CDATASection.js';
export { CharacterData } from './CharacterData.js';
export { ChildNode } from './ChildNode.js';
export { Comment } from './Comment.js';
export { Document } from './Document.js';
export { DocumentFragment } from './DocumentFragment.js';
export { DocumentType } from './DocumentType.js';
export { DOMTokenList, type ValueAccessor } from './DOMTokenList.js';
export { Element, type InsertPosition } from './Element.js';
export { NodeFilter } from './NodeFilter.js';
export { NodeList } from './NodeList.js';
export { ParentNode } from './ParentNode.js';
export { ProcessingInstruction } from './ProcessingInstruction.js';
export { Text } from './Text.js';
export { TreeWalker } from './TreeWalker.js';
export { getElementById } from './getElementById.js';
export { getElementsByClassName } from './getElementsByClassName.js';
export { getElementsByName } from './getElementsByName.js';
export { getElementsByTagName } from './getElementsByTagName.js';
