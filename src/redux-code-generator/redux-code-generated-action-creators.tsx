import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import generateActionCreators from '../code-generators/generate-action-creators';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage,
} from '../redux/redux.selectors';
import { IRootStore } from '../redux/root.type';

const ReduxCodeGeneratedActionCreatorsView = ({
  code,
  language,
}: ConnectedProps<typeof connector>) => (
  <CodeContainer
    title="Action Creators"
    code={code}
    language={language}
    id="action-creators"
  />
);

const connector = connect((state: IRootStore) => {
  const initialState = selectParsedInitialState(state);
  const language = selectReduxLanguage(state);

  return {
    language,
    code: initialState
      ? generateActionCreators(
          initialState,
          selectReduxCodeStorePrefix(state),
          language
        )
      : '// require valid initial state',
  };
});

export const ReduxCodeGeneratedActionCreators = connector(
  ReduxCodeGeneratedActionCreatorsView
);
