import { CharacterData } from './CharacterData.ts';
import { COMMENT_NODE, defineNodeType } from './utils.ts';

/**
 * @see [Comment](https://developer.mozilla.org/en-US/docs/Web/API/Comment) on MDN
 * @group Nodes
 */
export class Comment extends CharacterData {}

defineNodeType(Comment, COMMENT_NODE, '#comment');
