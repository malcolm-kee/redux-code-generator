import { IRootStore } from './root.type';

const parseJson = (jsonString: string) => {
  try {
     // eslint-disable-next-line
    return JSON.parse(JSON.stringify(eval(`(${jsonString})`)));
  } catch (e) {
    return null;
  }
};

const selectReduxCodeStore = (state: IRootStore) => state.redux;

export const selectReduxCodeInitialState = (state: IRootStore) =>
  selectReduxCodeStore(state).initialState;

export const selectParsedInitialState = (state: IRootStore) =>
  parseJson(selectReduxCodeInitialState(state));

export const selectReduxCodeStorePrefix = (state: IRootStore) =>
  selectReduxCodeStore(state).storePrefix;

export const selectReduxLanguage = (state: IRootStore) =>
  selectReduxCodeStore(state).language;
