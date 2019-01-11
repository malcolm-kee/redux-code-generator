import * as React from 'react';
import { joinClassName } from 'join-string';

interface FormGroupProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  required?: boolean;
}
export const FormGroup: React.FunctionComponent<FormGroupProps> = ({
  required,
  ...props
}) => (
  <div
    className={joinClassName('form-group', required && 'is-required')}
    {...props}
  />
);
