import React from 'react';
import { ReduxCodeGenerator } from './pages/redux-code-generator';

export class App extends React.Component {
  render() {
    return (
      <div className="App">
        <ReduxCodeGenerator />
      </div>
    );
  }
}

export default App;
