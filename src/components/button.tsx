import * as React from 'react';
import { joinClassName } from 'join-string';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: 'default' | 'success' | 'info' | 'warning' | 'danger';
}
export const Button: React.FunctionComponent<ButtonProps> = ({
  className,
  variant = 'default',
  ...props
}) => (
  <button
    className={joinClassName('btn', `btn-${variant}`, className)}
    {...props}
  />
);
