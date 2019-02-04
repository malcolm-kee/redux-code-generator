import * as React from 'react';
import { FormGroup } from './form-group';
import { Select, SelectProps } from './select';
import { HelpText } from './help-text';

interface SelectFieldProps extends SelectProps {
  labelText?: React.ReactNode;
  helpText?: React.ReactNode;
}
export const SelectField = React.forwardRef<
  HTMLSelectElement,
  SelectFieldProps
>(({ labelText, helpText, ...selectProps }, ref) => (
  <FormGroup required={selectProps.required}>
    {labelText && <label htmlFor={selectProps.id}>{labelText}</label>}
    <Select {...selectProps} ref={ref} />
    {helpText && <HelpText>{helpText}</HelpText>}
  </FormGroup>
));
