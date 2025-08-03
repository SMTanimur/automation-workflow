import React from 'react';
import { TriggerNode } from './nodes/TriggerNode';
import { EmailNode } from './nodes/EmailNode';
import { ConditionNode } from './nodes/ConditionNode';
import { EndNode } from './nodes/EndNode';
import { CustomEdge } from './edges/CustomEdge';

export { TriggerNode } from './nodes/TriggerNode';
export { EmailNode } from './nodes/EmailNode';
export { ConditionNode } from './nodes/ConditionNode';
export { EndNode } from './nodes/EndNode';
export { CustomEdge } from './edges/CustomEdge';

export const nodeTypes = {
  trigger: TriggerNode,
  email: EmailNode,
  condition: ConditionNode,
  end: EndNode,
};

export const edgeTypes = {
  custom: CustomEdge,
};
