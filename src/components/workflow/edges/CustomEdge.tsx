'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Mail, Settings } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: any;
  targetPosition: any;
  style?: any;
  markerEnd?: string;
  onAddNode?: (edgeId: string, nodeType: string) => void;
}

const availableNodeTypes = [
  { type: 'email', label: 'Email', icon: Mail, color: 'bg-green-500' },
  {
    type: 'condition',
    label: 'Condition',
    icon: Settings,
    color: 'bg-yellow-500',
  },
];

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  onAddNode,
}: CustomEdgeProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [edgePath] = useMemo(() => {
    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;

    return [
      `M ${sourceX} ${sourceY} Q ${centerX} ${centerY} ${targetX} ${targetY}`,
    ];
  }, [sourceX, sourceY, targetX, targetY]);

  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  const handleAddNode = (nodeType: string) => {
    if (onAddNode) {
      onAddNode(id, nodeType);
    }
    setIsPopoverOpen(false);
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className='react-flow__edge-path'
        d={edgePath}
        markerEnd={markerEnd}
      />
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <circle
            cx={centerX}
            cy={centerY}
            r={8}
            fill='white'
            stroke='#b1b1b7'
            strokeWidth={2}
            className='cursor-pointer hover:fill-blue-500 hover:stroke-blue-500 transition-colors'
            style={{ pointerEvents: 'all' }}
          />
        </PopoverTrigger>
        <PopoverContent className='w-48 p-2' side='top' align='center'>
          <div className='space-y-2'>
            <div className='text-sm font-medium text-gray-700 mb-2'>
              Add Node
            </div>
            {availableNodeTypes.map(nodeType => (
              <Button
                key={nodeType.type}
                variant='outline'
                size='sm'
                className='w-full justify-start gap-2'
                onClick={() => handleAddNode(nodeType.type)}
              >
                <nodeType.icon className='w-4 h-4' />
                {nodeType.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {/* Plus icon overlay */}
      <text
        x={centerX}
        y={centerY}
        textAnchor='middle'
        dominantBaseline='middle'
        className='pointer-events-none'
        style={{ fontSize: '12px', fill: '#6B7280' }}
      >
        +
      </text>
    </>
  );
}
