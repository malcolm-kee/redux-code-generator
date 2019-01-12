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
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    className={joinClassName('btn', `btn-${variant}`, className)}
    {...props}
  />
);

export const ButtonGroup: React.FunctionComponent<{
  justified?: boolean;
  role?: string;
}> = ({ justified, role = 'group', children }) => (
  <div
    role={role}
    className={joinClassName('btn-group', justified && 'btn-group-justified')}
  >
    {children}
  </div>
);
