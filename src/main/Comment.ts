import { CharacterData } from './CharacterData.js';
import { COMMENT_NODE } from './utils.js';

/**
 * @see [Comment](https://developer.mozilla.org/en-US/docs/Web/API/Comment) on MDN
 * @group Nodes
 */
export class Comment extends CharacterData {
  readonly nodeType: number = COMMENT_NODE;
  readonly nodeName: string = '#comment';
}
