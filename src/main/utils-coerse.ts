import { Text } from './Text';
import { Node } from './Node';
import { ChildNode } from './extendsChildNode';
import { assertChildNode } from './unchecked';

export function coerceAssertChildNodes(nodes: Array<Node | string>): asserts nodes is ChildNode[] {
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];

    if (typeof node === 'string') {
      nodes[i] = new Text(node);
    } else {
      assertChildNode(node);
    }
  }
}
