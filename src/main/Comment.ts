import { CharacterData } from './CharacterData.js';
import { Node } from './Node.js';

/**
 * @see [Comment](https://developer.mozilla.org/en-US/docs/Web/API/Comment) on MDN
 * @group Nodes
 */
export class Comment extends CharacterData {
  readonly nodeType: number = Node.COMMENT_NODE;
  readonly nodeName: string = '#comment';
}
