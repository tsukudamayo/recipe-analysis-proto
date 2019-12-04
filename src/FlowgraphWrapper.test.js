import React from 'react';

import { FlowgraphWrapper } from '../src/FlowgarphWrapper';
import { createContainer } from './domManipulators';

describe('FLowgraphWrapper', () => {
  let render, container;
  beforeEach(() => {
    ({ render, container } = createContainer());
  });
  it('rendes div to wrapper graph', () => {
    render(<FlowgraphWrapper />);
    expect(container.querySelector('div')).not.toBeNull();
  });
});
