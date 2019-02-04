import * as React from 'react';
import { connect } from 'react-redux';
import generateType from '../code-generators/generate-type';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage
} from '../redux/redux.selectors';
import { SupportedLanguage } from '../redux/redux.type';
import { IRootStore } from '../redux/root.type';

type ReduxCodeGeneratedActionCreatorsProps = {
  code: string;
  language: SupportedLanguage;
};
const ReduxCodeGeneratedTypeView: React.FunctionComponent<
  ReduxCodeGeneratedActionCreatorsProps
> = ({ code, language }) =>
  language === 'typescript' ? (
    <CodeContainer title="Types" code={code} language={language} />
  ) : null;

const mapStates = (state: IRootStore) => {
  const initialState = selectParsedInitialState(state);
  const language = selectReduxLanguage(state);

  return {
    language,
    code: initialState
      ? generateType(initialState, selectReduxCodeStorePrefix(state))
      : '// require valid initial state'
  };
};

export const ReduxCodeGeneratedType = connect(mapStates)(
  ReduxCodeGeneratedTypeView
);
