import React from 'react';

import { RadarChartWrapper } from './RadarChartWrapper';
import { createContainer } from './domManipulators';


describe('RadarChartWrapper', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const data = [
    { "key": "食材", "mean": 1.954192546583851 },
    { "key": "文字数", "mean": 1.3047501045924113 },
    { "key": "加熱", "mean": 0.8819875776397513 },
    { "key": "混ぜる", "mean": 1.6247139588100672 },
    { "key": "切る", "mean": 1.2644188110026617 }
  ];

  const recipename = {
    "key": "recipename",
    "mean": "平均"
  };

  it('renders a svg component', () => {
    render(
      <RadarChartWrapper
        data={data}
        recipename={recipename}
      />
    );
    expect(container.querySelector('svg')).not.toBeNull();
  });

});
