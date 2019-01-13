import React from 'react';
import { Provider } from 'react-redux';
import { ReduxCodeGenerator } from './pages/redux-code-generator';
import { configureStore } from './config/configure-store';

const store = configureStore();

export class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <ReduxCodeGenerator />
        </div>
      </Provider>
    );
  }
}

export default App;
