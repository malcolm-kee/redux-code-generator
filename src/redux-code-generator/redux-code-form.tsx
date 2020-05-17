import * as React from 'react';
import { connect } from 'react-redux';
import { InputField } from '../components/input-field';
import { Section } from '../components/section';
import { SelectField } from '../components/select-field';
import { TextAreaField } from '../components/textarea-field';
import {
  setReduxInitialState,
  setReduxLanguage,
  setReduxStorePrefix,
} from '../redux/redux.actions';
import {
  selectReduxCodeInitialState,
  selectReduxCodeStorePrefix,
  selectReduxLanguage,
} from '../redux/redux.selectors';
import { SupportedLanguage } from '../redux/redux.type';
import { IRootStore } from '../redux/root.type';

const styles: React.CSSProperties = {
  fontFamily: "Consolas, 'Courier New', monospace",
};

const packageLink = (
  <a
    href="https://www.npmjs.com/package/typesafe-actions"
    target="_BLANK"
    rel="noopener noreferrer"
  >
    <code>typesafe-action</code>
  </a>
);

type ReduxCodeFormProps = {
  initialState: string;
  storePrefix: string;
  language: SupportedLanguage;
  setInitialState: (value: string) => void;
  setStorePrefix: (value: string) => void;
  setLanguage: (language: SupportedLanguage) => void;
};
const ReduxCodeFormView: React.FunctionComponent<ReduxCodeFormProps> = ({
  initialState,
  storePrefix,
  language,
  setInitialState,
  setStorePrefix,
  setLanguage,
}) => (
  <Section variant="highlight">
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-md-6">
          <TextAreaField
            labelText="Initial State"
            value={initialState}
            onChangeValue={setInitialState}
            id="initial-state"
            required={true}
            autoFocus={true}
            style={styles}
          />
        </div>
        <div className="col-xs-12 col-md-6">
          <InputField
            labelText="Store Prefix"
            value={storePrefix}
            onChangeValue={setStorePrefix}
            id="store-prefix"
            style={styles}
          />
          <SelectField
            labelText="Language"
            value={language}
            onChangeValue={setLanguage as any}
            helpText={
              language === 'typescript' && (
                <span>Requires {packageLink} package</span>
              )
            }
            id="language"
          >
            <option value="javascript">Javascript</option>
            <option value="typescript">Typescript</option>
          </SelectField>
        </div>
      </div>
    </div>
  </Section>
);

const mapStates = (state: IRootStore) => ({
  initialState: selectReduxCodeInitialState(state),
  storePrefix: selectReduxCodeStorePrefix(state),
  language: selectReduxLanguage(state),
});

const mapDispatch = {
  setInitialState: setReduxInitialState,
  setStorePrefix: setReduxStorePrefix,
  setLanguage: setReduxLanguage,
};

export const ReduxCodeForm = connect(mapStates, mapDispatch)(ReduxCodeFormView);
