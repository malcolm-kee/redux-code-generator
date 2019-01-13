import * as React from 'react';
import { connect } from 'react-redux';
import generateTests from '../code-generators/generate-tests';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix
} from '../redux/redux.selectors';
import { RootStore } from '../redux/root.type';

type ReduxCodeGeneratedTestsProps = {
  code: string;
};
const ReduxCodeGeneratedTestsView: React.FunctionComponent<
  ReduxCodeGeneratedTestsProps
> = ({ code }) => <CodeContainer title="Tests" code={code} />;

const mapStates = (state: RootStore) => {
  const initialState = selectParsedInitialState(state);

  return {
    code: initialState
      ? generateTests(initialState, selectReduxCodeStorePrefix(state))
      : '// require valid initial state'
  };
};

export const ReduxCodeGeneratedTests = connect(mapStates)(
  ReduxCodeGeneratedTestsView
);
