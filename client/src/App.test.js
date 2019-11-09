import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Player from './components/Player'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App location={{hash:"123",search:"321"}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders player', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Player  ></Player>, div);
  ReactDOM.unmountComponentAtNode(div);
});
