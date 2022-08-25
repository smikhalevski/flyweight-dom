import { Node } from './Node';

export interface ChildNode extends Node {
  after(...nodes: Array<Node | string>): void;

  before(...nodes: Array<Node | string>): void;

  remove(): void;

  replaceWith(...nodes: Array<Node | string>): void;
}

export function extendChildNode(prototype: ChildNode): void {}
