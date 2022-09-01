import { CharacterData } from './CharacterData';
import { extendClass } from './utils';
import { NodeType } from './NodeType';
import { constructCharacterData } from './constructCharacterData';

export interface Comment extends CharacterData {}

export class Comment {
  constructor(data?: string) {
    constructCharacterData(this, NodeType.COMMENT_NODE, '#comment', data);
  }
}

extendClass(Comment, CharacterData);
