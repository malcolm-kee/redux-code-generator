import { combineReducers } from 'redux';
import { reduxCodeReducer } from './redux.reducer';
import { RootStore } from './root.type';

export const rootReducer = combineReducers<RootStore>({
  redux: reduxCodeReducer
});
