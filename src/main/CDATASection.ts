import { Text } from './Text.js';
import { CDATA_SECTION_NODE, defineNodeType } from './utils.js';

/**
 * @see [CDATASection](https://developer.mozilla.org/en-US/docs/Web/API/CDATASection) on MDN
 * @group Nodes
 */
export class CDATASection extends Text {}

defineNodeType(CDATASection, CDATA_SECTION_NODE, '#cdata-section');
