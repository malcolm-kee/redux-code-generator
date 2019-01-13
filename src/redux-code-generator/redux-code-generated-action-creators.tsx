import * as React from 'react';
import { connect } from 'react-redux';
import generateActionCreators from '../code-generators/generate-action-creators';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix
} from '../redux/redux.selectors';
import { RootStore } from '../redux/root.type';

type ReduxCodeGeneratedActionCreatorsProps = {
  code: string;
};
const ReduxCodeGeneratedActionCreatorsView: React.FunctionComponent<
  ReduxCodeGeneratedActionCreatorsProps
> = ({ code }) => <CodeContainer title="Action Creators" code={code} />;

const mapStates = (state: RootStore) => {
  const initialState = selectParsedInitialState(state);

  return {
    code: initialState
      ? generateActionCreators(initialState, selectReduxCodeStorePrefix(state))
      : '// require valid initial state'
  };
};

export const ReduxCodeGeneratedActionCreators = connect(mapStates)(
  ReduxCodeGeneratedActionCreatorsView
);
