import { Element } from './Element';

declare module './ParentNode.ts' {
  interface ParentNode {
    /**
     * @internal
     */
    _children: Element[] | undefined;
  }
}
