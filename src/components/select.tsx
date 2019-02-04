import { joinClassName } from 'join-string';
import * as React from 'react';
import { callAll } from '../lib';

export interface SelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  onChangeValue?: (value: string) => void;
}
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ onChangeValue, onChange, className, ...props }, ref) => (
    <select
      className={joinClassName('form-control', className)}
      onChange={callAll(
        onChange,
        onChangeValue && (ev => onChangeValue(ev.target.value))
      )}
      ref={ref}
      {...props}
    />
  )
);
