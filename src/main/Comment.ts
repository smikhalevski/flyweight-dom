import { CharacterData } from './CharacterData';
import { extendClass, NodeConstants } from './utils';

export interface Comment extends CharacterData {}

export class Comment {
  constructor(data = '') {
    this.data = data;
  }
}

extendClass(Comment, CharacterData, {
  nodeType: { value: NodeConstants.COMMENT_NODE },
  nodeName: { value: '#comment' },
});
