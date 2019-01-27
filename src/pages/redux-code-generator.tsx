import * as React from 'react';
import { Navbar, NavbarBrand, NavbarHeader } from '../components/navbar';
import { Section } from '../components/section';
import { LoadingIcon } from '../components/loading-icon';
import { ReduxCodeForm } from '../redux-code-generator/redux-code-form';

const ReduxCodeGeneratorCodeRenderer = React.lazy(() =>
  import(/* webpackChunkName: "CodeRenderer"  */ './redux-code-generator-code-renderer')
);

export const ReduxCodeGenerator = () => (
  <div>
    <Navbar variant="inverse">
      <NavbarHeader>
        <NavbarBrand>Redux Code Generator</NavbarBrand>
      </NavbarHeader>
    </Navbar>
    <ReduxCodeForm />
    <Section>
      <React.Suspense fallback={<LoadingIcon />}>
        <ReduxCodeGeneratorCodeRenderer />
      </React.Suspense>
    </Section>
  </div>
);
