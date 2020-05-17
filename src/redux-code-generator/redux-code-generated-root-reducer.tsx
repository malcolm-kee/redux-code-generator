import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { generateRootReducer } from '../code-generators/generate-reducer';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage,
} from '../redux/redux.selectors';
import { IRootStore } from '../redux/root.type';

const ReduxCodeGeneratedRootReducerView = ({
  code,
  hasPrefix,
}: ConnectedProps<typeof connector>) =>
  hasPrefix ? (
    <CodeContainer title="Root Reducer" code={code} id="root-reducer" />
  ) : null;

const connector = connect((state: IRootStore) => {
  const initialState = selectParsedInitialState(state);
  const prefix = selectReduxCodeStorePrefix(state);

  return {
    hasPrefix: !!prefix,
    code:
      initialState && prefix
        ? generateRootReducer(
            selectReduxCodeStorePrefix(state),
            selectReduxLanguage(state)
          )
        : '// require valid initial state',
  };
});

export const ReduxCodeGeneratedRootReducer = connector(
  ReduxCodeGeneratedRootReducerView
);
