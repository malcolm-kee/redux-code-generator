import * as React from 'react';
import { ReduxCodeGeneratedActionCreators } from '../redux-code-generator/redux-code-generated-action-creators';
import { ReduxCodeGeneratedActionKeys } from '../redux-code-generator/redux-code-generated-action-keys';
import { ReduxCodeGeneratedReducer } from '../redux-code-generator/redux-code-generated-reducer';
import { ReduxCodeGeneratedSelectors } from '../redux-code-generator/redux-code-generated-selectors';
import { ReduxCodeGeneratedTests } from '../redux-code-generator/redux-code-generated-tests';
import { ReduxCodeGeneratedRootReducer } from '../redux-code-generator/redux-code-generated-root-reducer';

const ReduxCodeGeneratorCodeRenderer = () => (
  <div className="container">
    <div className="row">
      <ReduxCodeGeneratedActionKeys />
      <ReduxCodeGeneratedActionCreators />
      <ReduxCodeGeneratedReducer />
      <ReduxCodeGeneratedRootReducer />
      <ReduxCodeGeneratedSelectors />
      <ReduxCodeGeneratedTests />
    </div>
  </div>
);

export default ReduxCodeGeneratorCodeRenderer;
