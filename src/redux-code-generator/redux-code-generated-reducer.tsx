import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import generateReducer from '../code-generators/generate-reducer';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage,
} from '../redux/redux.selectors';
import { IRootStore } from '../redux/root.type';

const ReduxCodeGeneratedReducerView = (
  props: ConnectedProps<typeof connector>
) => <CodeContainer title="Reducer" code={props.code} id="reducer" />;

const connector = connect((state: IRootStore) => {
  const initialState = selectParsedInitialState(state);

  return {
    code: initialState
      ? generateReducer(
          initialState,
          selectReduxCodeStorePrefix(state),
          selectReduxLanguage(state)
        )
      : '// require valid initial state',
  };
});

export const ReduxCodeGeneratedReducer = connector(
  ReduxCodeGeneratedReducerView
);
