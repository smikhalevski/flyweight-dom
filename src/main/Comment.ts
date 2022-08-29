import { CharacterData } from './CharacterData';
import { extendsClass } from './utils';
import { NodeType } from './NodeType';

export interface Comment extends CharacterData {}

export class Comment {
  constructor(data?: string) {
    CharacterData.call(this, NodeType.COMMENT_NODE, '#comment', data);
  }
}

extendsClass(Comment, CharacterData);
