import * as React from 'react';
import { FormGroup } from './form-group';
import { TextArea, TextAreaProps } from './textarea';

interface ITextAreaFieldProps extends TextAreaProps {
  labelText?: string;
}
export const TextAreaField: React.FunctionComponent<ITextAreaFieldProps> = ({
  labelText,
  id,
  ...props
}) => (
  <FormGroup>
    {labelText && <label htmlFor={id}>{labelText}</label>}
    <TextArea id={id} {...props} />
  </FormGroup>
);
