import * as React from 'react';
import { Navbar, NavbarBrand, NavbarHeader } from '../components/navbar';
import { Section } from '../components/section';
import { ReduxCodeForm } from '../redux-code-generator/redux-code-form';
import { ReduxCodeGeneratedActionCreators } from '../redux-code-generator/redux-code-generated-action-creators';
import { ReduxCodeGeneratedActionKeys } from '../redux-code-generator/redux-code-generated-action-keys';
import { ReduxCodeGeneratedReducer } from '../redux-code-generator/redux-code-generated-reducer';
import { ReduxCodeGeneratedSelectors } from '../redux-code-generator/redux-code-generated-selectors';
import { ReduxCodeGeneratedTests } from '../redux-code-generator/redux-code-generated-tests';
import { ReduxCodeGeneratedRootReducer } from '../redux-code-generator/redux-code-generated-root-reducer';

export const ReduxCodeGenerator = () => (
  <div>
    <Navbar variant="inverse">
      <NavbarHeader>
        <NavbarBrand>Redux Code Generator</NavbarBrand>
      </NavbarHeader>
    </Navbar>
    <ReduxCodeForm />
    <Section>
      <div className="container">
        <div className="row">
          <ReduxCodeGeneratedActionKeys />
          <ReduxCodeGeneratedActionCreators />
          <ReduxCodeGeneratedReducer />
          <ReduxCodeGeneratedRootReducer />
          <ReduxCodeGeneratedSelectors />
          <ReduxCodeGeneratedTests />
        </div>
      </div>
    </Section>
  </div>
);
