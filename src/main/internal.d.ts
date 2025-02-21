import { ChildNode } from './ChildNode';
import { Element } from './Element';

declare module './Node.ts' {
  interface Node {
    /**
     * @internal
     */
    _childNodes: ChildNode[] | undefined;
  }
}

declare module './ParentNode.ts' {
  interface ParentNode {
    /**
     * @internal
     */
    _children: Element[] | undefined;
  }
}
