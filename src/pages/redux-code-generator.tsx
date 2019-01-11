import * as React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import generateActionCreators from '../code-generators/generate-action-creators';
import generateActionKeys from '../code-generators/generate-action-keys';
import generateReducer from '../code-generators/generate-reducer';
import generateTests from '../code-generators/generate-tests';
import generateSelectors from '../code-generators/generator-selectors';
import { InputField } from '../components/input-field';
import { Section } from '../components/section';
import {
  TextAreaField,
  TextAreaFieldCollapsible
} from '../components/textarea-field';
import {
  CodeSnippet,
  CodeSnippetCollapsible
} from '../components/code-snippet';
import { Button } from '../components/button';

const parseJson = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
};

const initialState = `{
  "name": "",
  "isLoading": true,
  "customer": {
    "email": "",
    "age": 21
  }
}`;

const styles: React.CSSProperties = {
  fontFamily: "Consolas, 'Courier New', monospace"
};

const CodeContainer: React.FunctionComponent<{
  title: string;
  code: string;
}> = ({ title, code }) => (
  <div className="col-xs-12 col-md-6">
    <div className="Box">
      <div className="row">
        <h3 className="col-xs-8">{title}</h3>
        <div className="col-xs-4 text-right">
          <CopyToClipboard text={code}>
            <Button variant="success">Copy</Button>
          </CopyToClipboard>
        </div>
      </div>
      <CodeSnippetCollapsible code={code} />
    </div>
  </div>
);

export class ReduxCodeGenerator extends React.Component {
  state = {
    initialState,
    storePrefix: ''
  };

  handleInitialStateChange = (initialState: string) =>
    this.setState({ initialState });

  handleSetStorePrefix = (storePrefix: string) =>
    this.setState({ storePrefix });

  render() {
    const initialStateObject = parseJson(this.state.initialState);

    return (
      <div>
        <div className="container">
          <div className="row">
            <h2>Redux Code Generator</h2>
          </div>
        </div>
        <Section variant="highlight">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-6">
                <TextAreaField
                  labelText="Initial State"
                  value={this.state.initialState}
                  onChangeValue={this.handleInitialStateChange}
                  id="initial-state"
                  required={true}
                  autoFocus={true}
                  style={styles}
                />
              </div>
              <div className="col-xs-12 col-md-6">
                <InputField
                  labelText="Store Prefix"
                  value={this.state.storePrefix}
                  onChangeValue={this.handleSetStorePrefix}
                  id="store-prefix"
                  style={styles}
                />
              </div>
            </div>
          </div>
        </Section>
        <Section>
          <div className="container">
            <div className="row">
              <CodeContainer
                title="Action Keys"
                code={
                  initialStateObject
                    ? generateActionKeys(
                        initialStateObject,
                        this.state.storePrefix
                      )
                    : '// require valid initial state'
                }
              />
              <CodeContainer
                title="Action Creators"
                code={
                  initialStateObject
                    ? generateActionCreators(
                        initialStateObject,
                        this.state.storePrefix
                      )
                    : '// require valid initial state'
                }
              />
              <CodeContainer
                title="Reducer"
                code={
                  initialStateObject
                    ? generateReducer(
                        initialStateObject,
                        this.state.storePrefix
                      )
                    : '// require valid initial state'
                }
              />
              <CodeContainer
                title="Selectors"
                code={
                  initialStateObject
                    ? generateSelectors(
                        initialStateObject,
                        this.state.storePrefix
                      )
                    : '// require valid initial state'
                }
              />
              <CodeContainer
                title="Tests"
                code={
                  initialStateObject
                    ? generateTests(initialStateObject, this.state.storePrefix)
                    : '// require valid initial state'
                }
              />
            </div>
          </div>
        </Section>
      </div>
    );
  }
}
