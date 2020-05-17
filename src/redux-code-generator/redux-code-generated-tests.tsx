import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import generateTests from '../code-generators/generate-tests';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage,
} from '../redux/redux.selectors';
import { IRootStore } from '../redux/root.type';

const ReduxCodeGeneratedTestsView = ({
  code,
  lang,
}: ConnectedProps<typeof connector>) => (
  <CodeContainer title="Tests" code={code} language={lang} id="tests" />
);

const connector = connect((state: IRootStore) => {
  const initialState = selectParsedInitialState(state);
  const lang = selectReduxLanguage(state);

  return {
    lang,
    code: initialState
      ? generateTests(initialState, selectReduxCodeStorePrefix(state), lang)
      : '// require valid initial state',
  };
});

export const ReduxCodeGeneratedTests = connector(ReduxCodeGeneratedTestsView);
