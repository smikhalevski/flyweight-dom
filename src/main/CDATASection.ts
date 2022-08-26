import { Text } from './Text';
import { CharacterData } from './CharacterData';
import { createPrototype } from './utils';
import { NodeType } from './NodeType';

/**
 * @internal
 */
export interface CDATASection extends Text {}

/**
 * @internal
 */
export class CDATASection {
  constructor(data?: string) {
    CharacterData.call(this, NodeType.CDATA_SECTION_NODE, '#cdata-section', data);
  }
}

CDATASection.prototype = createPrototype(Text.prototype);
