import { NodeDragEventParams } from "rc-tree/es/contextTypes";
import { EventDataNode, Key } from "rc-tree/es/interface";

export type OnDrop = (
  info: NodeDragEventParams & {
    dragNode: EventDataNode;
    dragNodesKeys: Key[];
    dropPosition: number;
    dropToGap: boolean;
  }
) => void;
