import * as React from 'react';
import { connect } from 'react-redux';
import generateSelectors from '../code-generators/generate-selectors';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix
} from '../redux/redux.selectors';
import { RootStore } from '../redux/root.type';

type ReduxCodeGeneratedSelectorsProps = {
  code: string;
};
const ReduxCodeGeneratedSelectorsView: React.FunctionComponent<
  ReduxCodeGeneratedSelectorsProps
> = ({ code }) => <CodeContainer title="Selectors" code={code} />;

const mapStates = (state: RootStore) => {
  const initialState = selectParsedInitialState(state);

  return {
    code: initialState
      ? generateSelectors(initialState, selectReduxCodeStorePrefix(state))
      : '// require valid initial state'
  };
};

export const ReduxCodeGeneratedSelectors = connect(mapStates)(
  ReduxCodeGeneratedSelectorsView
);
