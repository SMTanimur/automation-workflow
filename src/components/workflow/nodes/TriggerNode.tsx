import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play } from 'lucide-react';

interface NodeData {
  label: string;
  type: 'trigger';
  config?: any;
}

export function TriggerNode({ data }: { data: NodeData }) {
  return (
    <div className='px-4 py-2 rounded-lg shadow-md bg-blue-500 text-white min-w-[120px]'>
      <Handle type='target' position={Position.Top} className='w-3 h-3' />
      <div className='flex items-center gap-2'>
        <Play className='w-4 h-4' />
        <span className='text-sm font-medium'>{data.label}</span>
      </div>
      <Handle type='source' position={Position.Bottom} className='w-3 h-3' />
    </div>
  );
}
