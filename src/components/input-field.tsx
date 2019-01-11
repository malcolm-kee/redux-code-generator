import * as React from 'react';
import { FormGroup } from './form-group';
import { Input, InputProps } from './input';
import { joinClassName } from 'join-string';

interface InputFieldProps extends InputProps {
  labelText?: string;
}
export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ labelText, id, className, ...inputProps }, ref) => (
    <FormGroup required={inputProps.required}>
      {labelText && <label htmlFor={id}>{labelText}</label>}
      <Input
        id={id}
        className={joinClassName('form-control', className)}
        {...inputProps}
        ref={ref}
      />
    </FormGroup>
  )
);
