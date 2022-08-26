import { Node } from './Node';

export interface ChildNode extends Node {
  after(...nodes: Array<Node | string>): void;

  before(...nodes: Array<Node | string>): void;

  remove(): void;

  replaceWith(...nodes: Array<Node | string>): void;
}

export function extendsChildNode(node: ChildNode): void {
  node.after = after;
  node.before = before;
  node.remove = remove;
  node.replaceWith = replaceWith;
}

function after(...nodes: Array<Node | string>): void {}

function before(...nodes: Array<Node | string>): void {}

function remove(): void {}

function replaceWith(...nodes: Array<Node | string>): void {}
