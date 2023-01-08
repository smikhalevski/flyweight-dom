import { CharacterData } from './CharacterData';
import { extendClass, NodeType } from './utils';

export interface Comment extends CharacterData {}

export class Comment {
  constructor(data = '') {
    this.data = data;
  }
}

const prototype = extendClass(Comment, CharacterData);

prototype.nodeType = NodeType.COMMENT_NODE;
prototype.nodeName = '#comment';
