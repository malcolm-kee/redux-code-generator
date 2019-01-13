import { action } from 'typesafe-actions';
import {
  SET_REDUX_INITIAL_STATE,
  SET_REDUX_STORE_PREFIX
} from './redux.action-keys';

export const setReduxInitialState = (initialState: string) =>
  action(SET_REDUX_INITIAL_STATE, initialState);

export const setReduxStorePrefix = (prefix: string) =>
  action(SET_REDUX_STORE_PREFIX, prefix);
