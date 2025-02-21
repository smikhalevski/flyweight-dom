import { CharacterData } from './CharacterData';
import { NodeConstants } from './utils';

/**
 * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Comment Comment} on MDN
 */
export class Comment extends CharacterData {
  readonly nodeType: number = NodeConstants.COMMENT_NODE;
  readonly nodeName: string = '#comment';
}
