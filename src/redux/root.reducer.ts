import { combineReducers } from 'redux';
import { reduxCodeReducer } from './redux.reducer';
import { IRootStore } from './root.type';

export const rootReducer = combineReducers<IRootStore>({
  redux: reduxCodeReducer
});
