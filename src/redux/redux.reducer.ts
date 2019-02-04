import { ActionType } from 'typesafe-actions';
import * as actionKeys from './redux.action-keys';
import * as actions from './redux.actions';
import { ReduxCodeStore } from './redux.type';

const initialState = `{
  name: '',
  isLoading: true,
  customer: {
    email: '',
    age: 21,
    info: null
  },
  data: null,
  friendNames: [''],
  connections: [
      {
        type: 'colleague',
        con: { man: 'Malcolm', data: null }
      }
  ],
}`;

const DEFAULT_STATE: ReduxCodeStore = {
  initialState,
  storePrefix: '',
  language: 'javascript'
};

export type ReduxCodeAction = ActionType<typeof actions>;

export const reduxCodeReducer = (
  state = DEFAULT_STATE,
  action: ReduxCodeAction
): ReduxCodeStore => {
  switch (action.type) {
    case actionKeys.SET_REDUX_INITIAL_STATE:
      return {
        ...state,
        initialState: action.payload
      };

    case actionKeys.SET_REDUX_STORE_PREFIX:
      return {
        ...state,
        storePrefix: action.payload
      };

    case actionKeys.SET_REDUX_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };

    default:
      return state;
  }
};
