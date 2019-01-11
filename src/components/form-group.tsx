import * as React from 'react';
import { joinClassName } from 'join-string';

type FormGroupProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
export const FormGroup: React.FunctionComponent<FormGroupProps> = props => (
  <div className={joinClassName('form-group')} {...props} />
);
