import React from 'react';
import {
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { CustomTooltip } from './CustomTooltip';

export const VerticalBarChartWrapper = ({ data, target, refference }) => (
  <BarChart
    width={1000}
    height={500}
    data={data}
    layout="vertical"
    margin={{top: 5, right: 30, left: 250, bottom: 5,}}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <YAxis type="category" dataKey="name" />
    <XAxis type="number" domain={[0, 'dataMax']}/>
    <Tooltip content={<CustomTooltip />} />
    <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
    <ReferenceLine y={0} height={30} stroke="#8884d8" />
    <ReferenceLine x={refference} height={30} stroke="#008000" label="このレシピ"/>
    <Bar dataKey={target} fill="#8884d8" />
  </BarChart>
);
