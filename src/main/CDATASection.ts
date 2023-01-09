import { Text } from './Text';
import { extendClass, NodeConstants } from './utils';

export interface CDATASection extends Text {}

export class CDATASection {
  constructor(data = '') {
    this.data = data;
  }
}

extendClass(CDATASection, Text, {
  nodeType: { value: NodeConstants.CDATA_SECTION_NODE },
  nodeName: { value: '#cdata-section' },
});
