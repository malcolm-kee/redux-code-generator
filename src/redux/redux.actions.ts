import { action } from 'typesafe-actions';
import * as actionKeys from './redux.action-keys';
import { SupportedLanguage } from './redux.type';

export const setReduxInitialState = (initialState: string) =>
  action(actionKeys.SET_REDUX_INITIAL_STATE, initialState);

export const setReduxStorePrefix = (storePrefix: string) =>
  action(actionKeys.SET_REDUX_STORE_PREFIX, storePrefix);

export const setReduxLanguage = (language: SupportedLanguage) =>
  action(actionKeys.SET_REDUX_LANGUAGE, language);
