import { ChildNode } from './ChildNode';

declare module './Node.ts' {
  interface Node {
    /**
     * @internal
     */
    _childNodes: ChildNode[] | undefined;
  }
}
