import './styles/globals.css';

import App from 'App';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';

ReactDOM.render(
  <RecoilRoot><App /></RecoilRoot>,
  document.getElementById('root'),
);
