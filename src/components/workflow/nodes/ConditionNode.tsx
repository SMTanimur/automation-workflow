import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Settings } from 'lucide-react';

interface NodeData {
  label: string;
  type: 'condition';
  config?: any;
}

export function ConditionNode({ data }: { data: NodeData }) {
  return (
    <div className="px-4 py-2 rounded-lg shadow-md bg-yellow-500 text-white min-w-[120px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3"
      />
    </div>
  );
} 