import { fireEvent, screen } from '@testing-library/react';
import * as React from 'react';
import { App } from './App';
import { renderWithState } from './test-lib';

test('action keys value', async () => {
  renderWithState(<App />);

  await screen.findByText('Action Keys');

  expect(document.getElementById('action-keys')).toMatchSnapshot();

  expect(screen.queryByText('Types')).toBeNull();

  fireEvent.change(screen.getByLabelText('Language'), {
    target: {
      value: 'typescript',
    },
  });

  expect(document.getElementById('action-keys')).toMatchSnapshot();
});

test('action creators value', async () => {
  renderWithState(<App />);

  await screen.findByText('Action Creators');

  expect(document.getElementById('action-creators')).toMatchSnapshot();

  fireEvent.change(screen.getByLabelText('Language'), {
    target: {
      value: 'typescript',
    },
  });

  expect(document.getElementById('action-creators')).toMatchSnapshot();
});

test('reducer value', async () => {
  renderWithState(<App />);

  await screen.findByText('Reducer');
  expect(screen.queryByText('Root Reducer')).toBeNull();

  expect(document.getElementById('reducer')).toMatchSnapshot();

  fireEvent.change(screen.getByLabelText('Language'), {
    target: {
      value: 'typescript',
    },
  });

  expect(document.getElementById('reducer')).toMatchSnapshot();

  fireEvent.change(screen.getByLabelText('Store Prefix'), {
    target: {
      value: 'main',
    },
  });

  expect(document.getElementById('reducer')).toMatchSnapshot();
  expect(document.getElementById('root-reducer')).toMatchSnapshot();
});

test('selectors initial value', async () => {
  renderWithState(<App />);

  await screen.findByText('Selectors');

  expect(document.getElementById('selectors')).toMatchSnapshot();
});
