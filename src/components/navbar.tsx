import * as React from 'react';
import { joinClassName } from 'join-string';

interface NavbarProps {
  variant?: 'default' | 'inverse';
}
export const Navbar: React.FunctionComponent<NavbarProps> = ({
  variant = 'default',
  children
}) => (
  <nav className={joinClassName('navbar', `navbar-${variant}`)}>
    <div className="container-fluid">{children}</div>
  </nav>
);

export const NavbarBrand: React.FunctionComponent = ({ children }) => (
  <div className="navbar-brand">{children}</div>
);

export const NavbarHeader: React.FunctionComponent = ({ children }) => (
  <div className="navbar-header">{children}</div>
);
