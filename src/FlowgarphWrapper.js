import React from 'react';
import { Graph } from 'react-d3-graph';

import { sampleGraphData } from './sampleGraphData';


const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    color: 'lightgreen',
    size: 120,
    highlightStrokeColor: 'blue',
    fontSize: 12,
    labelProperty: 'name'
  },
  link: {
    highlightColor: 'lightblue',
    fontColor: 'red',
    fontSize: 12,
    renderLabel: true,
    labelProperty: 'label'
  },
};

export const FlowgraphWrapper = ({data}) => {
  return (
    <div>
      <Graph
        id="graph-id"
        data={data}
        config={myConfig}
      />
    </div>
  );
};
