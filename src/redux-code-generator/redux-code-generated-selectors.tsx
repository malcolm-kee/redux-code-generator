import * as React from 'react';
import { connect } from 'react-redux';
import generateSelectors from '../code-generators/generate-selectors';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage
} from '../redux/redux.selectors';
import { SupportedLanguage } from '../redux/redux.type';
import { RootStore } from '../redux/root.type';

type ReduxCodeGeneratedSelectorsProps = {
  code: string;
  language: SupportedLanguage;
};
const ReduxCodeGeneratedSelectorsView: React.FunctionComponent<
  ReduxCodeGeneratedSelectorsProps
> = ({ code, language }) => (
  <CodeContainer title="Selectors" code={code} language={language} />
);

const mapStates = (state: RootStore) => {
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
      : '// require valid initial state'
  };
};

export const ReduxCodeGeneratedSelectors = connect(mapStates)(
  ReduxCodeGeneratedSelectorsView
);
