import { Text } from './Text';
import { CharacterData } from './CharacterData';
import { createPrototype } from './utils';
import { NodeType } from './NodeType';

export interface CDATASection extends Text {}

export class CDATASection {
  constructor(data?: string) {
    CharacterData.call(this, NodeType.CDATA_SECTION_NODE, data);
  }
}

CDATASection.prototype = createPrototype(Text.prototype);
