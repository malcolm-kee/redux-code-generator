import * as React from 'react';
import { connect } from 'react-redux';
import generateActionCreators from '../code-generators/generate-action-creators';
import { CodeContainer } from '../components/code-container';
import {
  selectParsedInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage
} from '../redux/redux.selectors';
import { RootStore } from '../redux/root.type';

type ReduxCodeGeneratedActionCreatorsProps = {
  code: string;
  language: string;
};
const ReduxCodeGeneratedActionCreatorsView: React.FunctionComponent<
  ReduxCodeGeneratedActionCreatorsProps
> = ({ code, language }) => (
  <CodeContainer title="Action Creators" code={code} language={language} />
);

const mapStates = (state: RootStore) => {
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
      : '// require valid initial state'
  };
};

export const ReduxCodeGeneratedActionCreators = connect(mapStates)(
  ReduxCodeGeneratedActionCreatorsView
);
