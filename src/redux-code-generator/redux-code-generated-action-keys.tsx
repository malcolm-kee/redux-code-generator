import * as React from 'react';
import { connect } from 'react-redux';
import generateActionKeys from '../code-generators/generate-action-keys';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage
} from '../redux/redux.selectors';
import { IRootStore } from '../redux/root.type';
import { SupportedLanguage } from '../redux/redux.type';

type ReduxCodeGeneratedActionKeysProps = {
  code: string;
  language: SupportedLanguage;
};
const ReduxCodeGeneratedActionKeysView: React.FunctionComponent<
  ReduxCodeGeneratedActionKeysProps
> = ({ code, language }) => (
  <CodeContainer title="Action Keys" code={code} language={language} />
);

const mapStates = (state: IRootStore) => {
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
      : '// require valid initial state'
  };
};

export const ReduxCodeGeneratedActionKeys = connect(mapStates)(
  ReduxCodeGeneratedActionKeysView
);
