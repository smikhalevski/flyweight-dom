import { Text } from './Text';
import { NodeConstants } from './utils';

/**
 * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/CDATASection CDATASection} on MDN
 */
export class CDATASection extends Text {
  readonly nodeType: number = NodeConstants.CDATA_SECTION_NODE;
  readonly nodeName: string = '#cdata-section';
}
