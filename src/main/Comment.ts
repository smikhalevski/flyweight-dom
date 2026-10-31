import { CharacterData } from './CharacterData.js';
import { COMMENT_NODE, defineNodeType } from './utils.js';

/**
 * @see [Comment](https://developer.mozilla.org/en-US/docs/Web/API/Comment) on MDN
 * @group Nodes
 */
export class Comment extends CharacterData {}

defineNodeType(Comment, COMMENT_NODE, '#comment');
