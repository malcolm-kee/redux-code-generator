import { render } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from './config/configure-store';

export const renderWithState = (ui: React.ReactNode) => {
  const store = configureStore();

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};
