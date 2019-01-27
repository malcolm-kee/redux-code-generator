import * as React from 'react';
import { joinClassName } from 'join-string';

interface IHelpTextProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {}
export const HelpText = React.forwardRef<HTMLSpanElement, IHelpTextProps>(
  ({ className, ...props }, ref) => (
    <span
      className={joinClassName('help-block', className)}
      {...props}
      ref={ref}
    />
  )
);
