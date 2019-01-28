import * as React from 'react';
import { connect } from 'react-redux';
import generateReducer from '../code-generators/generate-reducer';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage
} from '../redux/redux.selectors';
import { RootStore } from '../redux/root.type';

type ReduxCodeGeneratedReducerProps = {
  code: string;
};
const ReduxCodeGeneratedReducerView: React.FunctionComponent<
  ReduxCodeGeneratedReducerProps
> = ({ code }) => <CodeContainer title="Reducer" code={code} />;

const mapStates = (state: RootStore) => {
  const initialState = selectParsedInitialState(state);

  return {
    code: initialState
      ? generateReducer(
          initialState,
          selectReduxCodeStorePrefix(state),
          selectReduxLanguage(state)
        )
      : '// require valid initial state'
  };
};

export const ReduxCodeGeneratedReducer = connect(mapStates)(
  ReduxCodeGeneratedReducerView
);
