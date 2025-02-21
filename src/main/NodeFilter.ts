import { NodeFilterConstants } from './utils';
import { Node } from './Node';

export type NodeFilter = ((node: Node) => number) | { acceptNode(node: Node): number };

/**
 * **See** {@linkcode https://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-NodeFilter NodeFilter} on W3C
 */
export const NodeFilter = {
  FILTER_ACCEPT: NodeFilterConstants.FILTER_ACCEPT as number,
  FILTER_REJECT: NodeFilterConstants.FILTER_REJECT as number,
  FILTER_SKIP: NodeFilterConstants.FILTER_SKIP as number,
  SHOW_ALL: NodeFilterConstants.SHOW_ALL as number,
  SHOW_ATTRIBUTE: NodeFilterConstants.SHOW_ATTRIBUTE as number,
  SHOW_CDATA_SECTION: NodeFilterConstants.SHOW_CDATA_SECTION as number,
  SHOW_COMMENT: NodeFilterConstants.SHOW_COMMENT as number,
  SHOW_DOCUMENT: NodeFilterConstants.SHOW_DOCUMENT as number,
  SHOW_DOCUMENT_FRAGMENT: NodeFilterConstants.SHOW_DOCUMENT_FRAGMENT as number,
  SHOW_DOCUMENT_TYPE: NodeFilterConstants.SHOW_DOCUMENT_TYPE as number,
  SHOW_ELEMENT: NodeFilterConstants.SHOW_ELEMENT as number,
  SHOW_PROCESSING_INSTRUCTION: NodeFilterConstants.SHOW_PROCESSING_INSTRUCTION as number,
  SHOW_TEXT: NodeFilterConstants.SHOW_TEXT as number,
} as const;
