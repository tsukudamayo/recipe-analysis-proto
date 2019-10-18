import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

export const RadarChartWrapper = ({ data, recipename }) => (
  <div>
    <RadarChart cx={300} cy={300} outerRadius={250} width={750} height={550} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="key" />
      <PolarRadiusAxis angle={90} domain={[0.0, 5.0]} tickCount={6} />
      <Radar
        name={recipename['target']}
        dataKey="target"
        stroke="#ff4500"
        fill="#ffbf7f"
        fillOpacity={0.6}
      />
      <Radar
        name={recipename['mean']}
        dataKey="mean"
        stroke="#4169e1"
        fill="#a8d3ff"
        fillOpacity={0.6}
      />
      <Legend />
    </RadarChart>
  </div>
);
