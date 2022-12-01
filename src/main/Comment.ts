import { CharacterData } from './CharacterData';
import { extendClass } from './utils';
import { NodeType } from './NodeType';

export interface Comment extends CharacterData {}

export class Comment {
  constructor(data = '') {
    this.data = String(data);
  }
}

const parent = extendClass(Comment, CharacterData);

parent.nodeType = NodeType.COMMENT_NODE;
parent.nodeName = '#comment';
