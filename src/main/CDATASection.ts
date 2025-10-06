import { Text } from './Text.js';
import { CDATA_SECTION_NODE } from './utils.js';

/**
 * @see [CDATASection](https://developer.mozilla.org/en-US/docs/Web/API/CDATASection) on MDN
 * @group Nodes
 */
export class CDATASection extends Text {
  readonly nodeType: number = CDATA_SECTION_NODE;
  readonly nodeName: string = '#cdata-section';
}
