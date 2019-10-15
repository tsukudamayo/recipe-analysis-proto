import React from 'react';

import { BarChartWrapper } from './BarChartWrapper';
import { createContainer } from './domManipulators';

describe('Barchartwrapper', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const data = [
    { action: '取り除', time: 2, },
    { action: '切', time: 6, },
    { action: 'つけ', time: 1, },
    { action: 'からめ',time: 1, },
    { action: '加え', time: 1, },
    { action: '混ぜ合わせ', time: 1 }
  ];

  it('renders a svg component', () => {
    render(
      <BarChartWrapper
        data={data}
      />
    );
    expect(container.querySelector('svg')).not.toBeNull();
  });
});
