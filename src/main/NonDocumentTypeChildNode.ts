import { Element } from './Element';
import { ChildNode } from './extendsChildNode';

/**
 * @internal
 */
export interface NonDocumentTypeChildNode extends ChildNode {
  /*readonly*/ nextElementSibling: Element | null;
  /*readonly*/ previousElementSibling: Element | null;
}
