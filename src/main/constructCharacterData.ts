import { CharacterData } from './CharacterData';
import { constructNode } from './constructNode';

export function constructCharacterData(node: CharacterData, nodeType: number, nodeName: string, data = ''): void {
  constructNode(node, nodeType, nodeName);

  node.nextElementSibling = node.previousElementSibling = null;
  node.data = data;
}
