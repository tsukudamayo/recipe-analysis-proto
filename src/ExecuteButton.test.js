import React from 'react';
import ReactDOM from 'react-dom';

import { ExecuteButton } from './ExecuteButton';

describe('ExecuteButton', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
  });
  const render = (component) => {
    ReactDOM.render(component, container);
  };
  it('renders a div with the right id', () => {
    render(<ExecuteButton />);
    expect(container.querySelector('div#executeButton')).not.toBeNull();
    expect(container.querySelector('ol').children).toHaveLength(2);
  });
  it('renders multiple button in an ol element', () => {
    render(<ExecuteButton />);
    expect(container.querySelector('ol')).not.toBeNull();
  });
  it('has two buttons', () => {
    render(<ExecuteButton />);
    expect(container.querySelectorAll('li > button')[0].type).toEqual('button');
    expect(container.querySelectorAll('li > button')).toHaveLength(2);
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
});
