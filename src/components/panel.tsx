import * as React from 'react';
import { joinClassName } from 'join-string';

interface PanelProps {
  variant?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
}
export const Panel: React.FunctionComponent<PanelProps> = ({
  variant = 'default',
  children
}) => (
  <div className={joinClassName('panel', `panel-${variant}`)}>{children}</div>
);

export const PanelHeading: React.FunctionComponent<{ className?: string }> = ({
  className,
  children
}) => (
  <div className={joinClassName('panel-heading', className)}>{children}</div>
);

export const PanelTitle: React.FunctionComponent = ({ children }) => (
  <h3 className="panel-title">{children}</h3>
);

export const PanelBody: React.FunctionComponent = ({ children }) => (
  <div className="panel-body">{children}</div>
);

export const PanelFooter: React.FunctionComponent = ({ children }) => (
  <div className="panel-footer">{children}</div>
);
