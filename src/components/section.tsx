import * as React from 'react';
import { joinClassName } from 'join-string';

interface SectionProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  variant?: 'alt' | 'dark' | 'highlight' | 'highlight-dark';
}
export const Section: React.FunctionComponent<SectionProps> = ({
  className,
  variant,
  ...props
}) => (
  <div
    className={joinClassName(
      'Section',
      variant && `Section--${variant}`,
      className
    )}
    {...props}
  />
);
