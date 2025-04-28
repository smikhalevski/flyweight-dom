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

export { CDATASection } from './CDATASection';
export { CharacterData } from './CharacterData';
export { ChildNode } from './ChildNode';
export { Comment } from './Comment';
export { Document } from './Document';
export { DocumentFragment } from './DocumentFragment';
export { DocumentType } from './DocumentType';
export { DOMTokenList, type ValueAccessor } from './DOMTokenList';
export { Element, type InsertPosition, type Attributes } from './Element';
export { Node } from './Node';
export { NodeFilter } from './NodeFilter';
export { ParentNode } from './ParentNode';
export { ProcessingInstruction } from './ProcessingInstruction';
export { Text } from './Text';
export { TreeWalker } from './TreeWalker';
export { type Constructor, type AbstractConstructor } from './utils';
