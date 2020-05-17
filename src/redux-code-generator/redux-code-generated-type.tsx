import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import generateType from '../code-generators/generate-type';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage,
} from '../redux/redux.selectors';
import { IRootStore } from '../redux/root.type';

const ReduxCodeGeneratedTypeView = ({
  code,
  language,
}: ConnectedProps<typeof connector>) =>
  language === 'typescript' ? (
    <CodeContainer title="Types" code={code} language={language} id="types" />
  ) : null;

const connector = connect((state: IRootStore) => {
  const initialState = selectParsedInitialState(state);
  const language = selectReduxLanguage(state);

  return {
    language,
    code: initialState
      ? generateType(initialState, selectReduxCodeStorePrefix(state))
      : '// require valid initial state',
  };
});

export const ReduxCodeGeneratedType = connector(ReduxCodeGeneratedTypeView);
