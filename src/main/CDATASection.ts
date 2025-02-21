import { Text } from './Text';
import { Node } from './Node';

/**
 * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/CDATASection CDATASection} on MDN
 */
export class CDATASection extends Text {
  readonly nodeType: number = Node.CDATA_SECTION_NODE;
  readonly nodeName: string = '#cdata-section';
}
