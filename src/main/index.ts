export * from './Attr';
export * from './CharacterData';
export * from './Comment';
export * from './Element';
export * from './NamedNodeMap';
export * from './Node';
export * from './ProcessingInstruction';
export * from './Text';

type a = Element;

// import { ParentNode } from './extendsParentNode';
// import { ChildNode } from './extendsChildNode';
// import { Element } from './Element';
//
// export declare class Node {
//   readonly nodeType: number;
//   readonly nodeName: string;
//   readonly parentNode: ParentNode | null;
//   readonly parentElement: Element | null;
//   readonly previousSibling: ChildNode | null;
//   readonly nextSibling: ChildNode | null;
//   readonly firstChild: ChildNode | null;
//   readonly lastChild: ChildNode | null;
//   readonly childNodes: readonly ChildNode[];
//
//   nodeValue: string | null;
//   textContent: string | null;
//
//   hasChildNodes(): boolean;
//
//   appendChild<T extends Node>(node: T): T;
//
//   insertBefore<T extends Node>(node: T, child: Node | null): T;
//
//   removeChild<T extends Node>(child: T): T;
//
//   replaceChild<T extends Node>(node: Node, child: T): T;
//
//   cloneNode(deep?: boolean): Node;
// }
