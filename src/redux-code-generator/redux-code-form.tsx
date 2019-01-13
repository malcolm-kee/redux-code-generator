import * as React from 'react';
import { connect } from 'react-redux';
import { InputField } from '../components/input-field';
import { Section } from '../components/section';
import { TextAreaField } from '../components/textarea-field';
import {
  setReduxInitialState,
  setReduxStorePrefix
} from '../redux/redux.actions';
import {
  selectReduxCodeInitialState,
  selectReduxCodeStorePrefix
} from '../redux/redux.selectors';
import { RootStore } from '../redux/root.type';

const styles: React.CSSProperties = {
  fontFamily: "Consolas, 'Courier New', monospace"
};

type ReduxCodeFormProps = {
  initialState: string;
  storePrefix: string;
  setInitialState: (value: string) => void;
  setStorePrefix: (value: string) => void;
};
const ReduxCodeFormView: React.FunctionComponent<ReduxCodeFormProps> = ({
  initialState,
  storePrefix,
  setInitialState,
  setStorePrefix
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
        </div>
      </div>
    </div>
  </Section>
);

const mapStates = (state: RootStore) => ({
  initialState: selectReduxCodeInitialState(state),
  storePrefix: selectReduxCodeStorePrefix(state)
});

const mapDispatch = {
  setInitialState: setReduxInitialState,
  setStorePrefix: setReduxStorePrefix
};

export const ReduxCodeForm = connect(
  mapStates,
  mapDispatch
)(ReduxCodeFormView);
