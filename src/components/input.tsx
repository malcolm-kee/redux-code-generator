import * as React from 'react';
import { callAll } from '../lib';

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  onChangeValue?: (value: string) => void;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ onChangeValue, onChange, ...props }) => (
    <input
      onChange={callAll(
        onChange,
        onChangeValue && (ev => onChangeValue(ev.target.value))
      )}
      {...props}
    />
  )
);
