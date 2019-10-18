import React from 'react';

import {
  BarChart,
  Bar,
  Brush,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const BarChartWrapper = ({ data }) => (
  <BarChart
    width={1000}
    height={500}
    data={data}
    margin={{top: 5, right: 30, left: 0, bottom: 5,}}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="action" />
    <YAxis dataKey="time"/>
    <Tooltip />
    <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
    <Brush dataKey="action" height={30} stroke="#000" />
    <Bar dataKey="time" fill="#8884d8" />
  </BarChart>
);
