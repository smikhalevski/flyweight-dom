import { CharacterData } from './CharacterData';
import { extendClass, NodeType } from './utils';

export interface Comment extends CharacterData {}

export class Comment {
  constructor(data = '') {
    this.data = data;
  }
}

extendClass(Comment, CharacterData, {
  nodeType: { value: NodeType.COMMENT_NODE },
  nodeName: { value: '#comment' },
});
