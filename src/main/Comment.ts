import { CharacterData } from './CharacterData';
import { extendsClass } from './utils';
import { NodeType } from './NodeType';

/**
 * @internal
 */
export interface Comment extends CharacterData {}

/**
 * @internal
 */
export class Comment {
  constructor(data?: string) {
    CharacterData.call(this, NodeType.COMMENT_NODE, '#comment', data);
  }
}

extendsClass(Comment, CharacterData);
