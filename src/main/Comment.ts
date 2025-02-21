import { CharacterData } from './CharacterData';
import { Node } from './Node';

/**
 * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Comment Comment} on MDN
 */
export class Comment extends CharacterData {
  readonly nodeType: number = Node.COMMENT_NODE;
  readonly nodeName: string = '#comment';
}
