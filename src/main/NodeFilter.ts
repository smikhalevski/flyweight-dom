import { NodeFilterConstants } from './utils';
import { Node } from './Node';

export type NodeFilter = ((node: Node) => number) | { acceptNode(node: Node): number };

export const NodeFilter = {
  FILTER_ACCEPT: NodeFilterConstants.FILTER_ACCEPT,
  FILTER_REJECT: NodeFilterConstants.FILTER_REJECT,
  FILTER_SKIP: NodeFilterConstants.FILTER_SKIP,
  SHOW_ALL: NodeFilterConstants.SHOW_ALL,
  SHOW_ATTRIBUTE: NodeFilterConstants.SHOW_ATTRIBUTE,
  SHOW_CDATA_SECTION: NodeFilterConstants.SHOW_CDATA_SECTION,
  SHOW_COMMENT: NodeFilterConstants.SHOW_COMMENT,
  SHOW_DOCUMENT: NodeFilterConstants.SHOW_DOCUMENT,
  SHOW_DOCUMENT_FRAGMENT: NodeFilterConstants.SHOW_DOCUMENT_FRAGMENT,
  SHOW_DOCUMENT_TYPE: NodeFilterConstants.SHOW_DOCUMENT_TYPE,
  SHOW_ELEMENT: NodeFilterConstants.SHOW_ELEMENT,
  SHOW_PROCESSING_INSTRUCTION: NodeFilterConstants.SHOW_PROCESSING_INSTRUCTION,
  SHOW_TEXT: NodeFilterConstants.SHOW_TEXT,
};
