import * as React from 'react';
import { connect } from 'react-redux';
import generateActionKeys from '../code-generators/generate-action-keys';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage
} from '../redux/redux.selectors';
import { RootStore } from '../redux/root.type';

type ReduxCodeGeneratedActionKeysProps = {
  code: string;
};
const ReduxCodeGeneratedActionKeysView: React.FunctionComponent<
  ReduxCodeGeneratedActionKeysProps
> = ({ code }) => <CodeContainer title="Action Keys" code={code} />;

const mapStates = (state: RootStore) => {
  const initialState = selectParsedInitialState(state);

  return {
    code: initialState
      ? generateActionKeys(
          initialState,
          selectReduxCodeStorePrefix(state),
          selectReduxLanguage(state)
        )
      : '// require valid initial state'
  };
};

export const ReduxCodeGeneratedActionKeys = connect(mapStates)(
  ReduxCodeGeneratedActionKeysView
);
