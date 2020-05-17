import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import generateSelectors from '../code-generators/generate-selectors';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage,
} from '../redux/redux.selectors';
import { IRootStore } from '../redux/root.type';

const ReduxCodeGeneratedSelectorsView = ({
  code,
  language,
}: ConnectedProps<typeof connector>) => (
  <CodeContainer
    title="Selectors"
    code={code}
    language={language}
    id="selectors"
  />
);

const connector = connect((state: IRootStore) => {
  const initialState = selectParsedInitialState(state);
  const language = selectReduxLanguage(state);

  return {
    language,
    code: initialState
      ? generateSelectors(
          initialState,
          selectReduxCodeStorePrefix(state),
          language
        )
      : '// require valid initial state',
  };
});

export const ReduxCodeGeneratedSelectors = connector(
  ReduxCodeGeneratedSelectorsView
);
