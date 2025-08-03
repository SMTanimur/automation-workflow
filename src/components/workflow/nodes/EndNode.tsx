import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap } from 'lucide-react';

interface NodeData {
  label: string;
  type: 'end';
  config?: any;
}

export function EndNode({ data }: { data: NodeData }) {
  return (
    <div className='px-4 py-2 rounded-lg shadow-md bg-red-500 text-white min-w-[120px]'>
      <Handle type='target' position={Position.Top} className='w-3 h-3' />
      <div className='flex items-center gap-2'>
        <Zap className='w-4 h-4' />
        <span className='text-sm font-medium'>{data.label}</span>
      </div>
    </div>
  );
}
