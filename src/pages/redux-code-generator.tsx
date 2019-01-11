import * as React from 'react';
import { TextAreaField } from '../components/textarea-field';
import generateActionKeys from '../code-generators/generate-action-keys';

const parseJson = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
};

export class ReduxCodeGenerator extends React.Component {
  state = {
    initialState: ''
  };

  handleInitialStateChange = (initialState: string) =>
    this.setState({ initialState });

  render() {
    const initialStateObject = parseJson(this.state.initialState);

    return (
      <div className="container">
        <div className="row">
          <h2>Redux Code Generator</h2>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <TextAreaField
              labelText="Initial State"
              value={this.state.initialState}
              onChangeValue={this.handleInitialStateChange}
              id="initial-state"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-4">
            <TextAreaField
              labelText="Action Keys"
              value={
                initialStateObject ? generateActionKeys(initialStateObject) : ''
              }
              readOnly
            />
          </div>
        </div>
      </div>
    );
  }
}
