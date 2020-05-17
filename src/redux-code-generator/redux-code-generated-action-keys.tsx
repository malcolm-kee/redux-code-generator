import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import generateActionKeys from '../code-generators/generate-action-keys';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage,
} from '../redux/redux.selectors';
import { IRootStore } from '../redux/root.type';

const ReduxCodeGeneratedActionKeysView = ({
  code,
  language,
}: ConnectedProps<typeof connector>) => (
  <CodeContainer
    title="Action Keys"
    code={code}
    language={language}
    id="action-keys"
  />
);

const connector = connect((state: IRootStore) => {
  const initialState = selectParsedInitialState(state);
  const language = selectReduxLanguage(state);

  return {
    language,
    code: initialState
      ? generateActionKeys(
          initialState,
          selectReduxCodeStorePrefix(state),
          language
        )
      : '// require valid initial state',
  };
});

export const ReduxCodeGeneratedActionKeys = connector(
  ReduxCodeGeneratedActionKeysView
);
