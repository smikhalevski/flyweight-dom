import { Text } from './Text';
import { extendClass } from './utils';
import { NodeType } from './NodeType';
import { constructCharacterData } from './constructCharacterData';

export interface CDATASection extends Text {}

export class CDATASection {
  constructor(data?: string) {
    constructCharacterData(this, NodeType.CDATA_SECTION_NODE, '#cdata-section', data);
  }
}

extendClass(CDATASection, Text);
