import * as React from 'react';
import { FormGroup } from './form-group';
import { Select, SelectProps } from './select';

interface SelectFieldProps extends SelectProps {
  labelText?: string;
}
export const SelectField = React.forwardRef<
  HTMLSelectElement,
  SelectFieldProps
>(({ labelText, id, className, ...selectProps }, ref) => (
  <FormGroup required={selectProps.required}>
    {labelText && <label htmlFor={id}>{labelText}</label>}
    <Select id={id} className={className} {...selectProps} ref={ref} />
  </FormGroup>
));
