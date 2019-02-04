import * as React from 'react';
import { connect } from 'react-redux';
import generateTests from '../code-generators/generate-tests';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage
} from '../redux/redux.selectors';
import { IRootStore } from '../redux/root.type';
import { SupportedLanguage } from '../redux/redux.type';

type ReduxCodeGeneratedTestsProps = {
  code: string;
  lang: SupportedLanguage;
};
const ReduxCodeGeneratedTestsView: React.FunctionComponent<
  ReduxCodeGeneratedTestsProps
> = ({ code, lang }) => (
  <CodeContainer title="Tests" code={code} language={lang} />
);

const mapStates = (state: IRootStore) => {
  const initialState = selectParsedInitialState(state);
  const lang = selectReduxLanguage(state);

  return {
    lang,
    code: initialState
      ? generateTests(initialState, selectReduxCodeStorePrefix(state), lang)
      : '// require valid initial state'
  };
};

export const ReduxCodeGeneratedTests = connect(mapStates)(
  ReduxCodeGeneratedTestsView
);
