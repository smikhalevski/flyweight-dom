import { Node } from './Node.js';

/**
 * @group Other
 */
export type NodeFilter = ((node: Node) => number) | { acceptNode(node: Node): number };

/**
 * @see {@link https://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-NodeFilter NodeFilter} on W3C
 * @group Other
 */
export const NodeFilter = {
  FILTER_ACCEPT: 1,
  FILTER_REJECT: 2,
  FILTER_SKIP: 3,
  SHOW_ALL: 0xffffffff,
  SHOW_ATTRIBUTE: 2,
  SHOW_CDATA_SECTION: 8,
  SHOW_COMMENT: 128,
  SHOW_DOCUMENT: 256,
  SHOW_DOCUMENT_FRAGMENT: 1024,
  SHOW_DOCUMENT_TYPE: 512,
  SHOW_ELEMENT: 1,
  SHOW_PROCESSING_INSTRUCTION: 64,
  SHOW_TEXT: 4,
} as const;
