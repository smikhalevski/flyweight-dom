import { Text } from './Text';
import { extendClass, NodeType } from './utils';

export interface CDATASection extends Text {}

export class CDATASection {
  constructor(data = '') {
    this.data = data;
  }
}

const prototype = extendClass(CDATASection, Text);

prototype.nodeType = NodeType.CDATA_SECTION_NODE;
prototype.nodeName = '#cdata-section';
