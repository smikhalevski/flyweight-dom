import { Text } from './Text';
import { extendClass } from './utils';
import { NodeType } from './NodeType';

export interface CDATASection extends Text {}

export class CDATASection {
  constructor(data = '') {
    this.data = String(data);
  }
}

const prototype = extendClass(CDATASection, Text);

prototype.nodeType = NodeType.CDATA_SECTION_NODE;
prototype.nodeName = '#cdata-section';
