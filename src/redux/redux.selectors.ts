import { RootStore } from './root.type';

const parseJson = (jsonString: string) => {
  try {
    return JSON.parse(JSON.stringify(eval(`(${jsonString})`)));
  } catch (e) {
    return null;
  }
};

const selectReduxCodeStore = (state: RootStore) => state.redux;

export const selectReduxCodeInitialState = (state: RootStore) =>
  selectReduxCodeStore(state).initialState;

export const selectParsedInitialState = (state: RootStore) =>
  parseJson(selectReduxCodeInitialState(state));

export const selectReduxCodeStorePrefix = (state: RootStore) =>
  selectReduxCodeStore(state).storePrefix;

export const selectReduxLanguage = (state: RootStore) =>
  selectReduxCodeStore(state).language;
