import { CharacterData } from './CharacterData';
import { createPrototype } from './utils';
import { NodeType } from './NodeType';

export interface Comment extends CharacterData {}

export class Comment {
  constructor(data?: string) {
    CharacterData.call(this, NodeType.COMMENT_NODE, '#comment', data);
  }
}

Comment.prototype = createPrototype(CharacterData.prototype);
