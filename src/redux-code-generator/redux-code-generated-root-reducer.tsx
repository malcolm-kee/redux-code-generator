import * as React from 'react';
import { connect } from 'react-redux';
import { generateRootReducer } from '../code-generators/generate-reducer';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix
} from '../redux/redux.selectors';
import { RootStore } from '../redux/root.type';

type ReduxCodeGeneratedRootReducerProps = {
  code: string;
  hasPrefix: boolean;
};
const ReduxCodeGeneratedRootReducerView: React.FunctionComponent<
  ReduxCodeGeneratedRootReducerProps
> = ({ code, hasPrefix }) =>
  hasPrefix ? <CodeContainer title="Root Reducer" code={code} /> : null;

const mapStates = (state: RootStore) => {
  const initialState = selectParsedInitialState(state);
  const prefix = selectReduxCodeStorePrefix(state);

  return {
    hasPrefix: !!prefix,
    code:
      initialState && prefix
        ? generateRootReducer(selectReduxCodeStorePrefix(state))
        : '// require valid initial state'
  };
};

export const ReduxCodeGeneratedRootReducer = connect(mapStates)(
  ReduxCodeGeneratedRootReducerView
);
