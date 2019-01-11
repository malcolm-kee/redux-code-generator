import * as React from 'react';
import { FormGroup } from './form-group';
import { TextArea, TextAreaProps } from './textarea';
import { Button } from './button';

interface ITextAreaFieldProps extends TextAreaProps {
  labelText?: string;
  bottomSection?: React.ReactNode;
}
export const TextAreaField: React.FunctionComponent<ITextAreaFieldProps> = ({
  labelText,
  id,
  bottomSection,
  ...props
}) => (
  <FormGroup required={props.required}>
    {labelText && <label htmlFor={id}>{labelText}</label>}
    <TextArea id={id} {...props} />
    {bottomSection}
  </FormGroup>
);

export class TextAreaFieldCollapsible extends React.Component<
  ITextAreaFieldProps,
  { showAll: boolean }
> {
  state = {
    showAll: false
  };

  toggleShowAll = () =>
    this.setState(prevState => ({ showAll: !prevState.showAll }));

  render() {
    const props = this.props;

    return (
      <TextAreaField
        maxRows={this.state.showAll ? undefined : 6}
        {...props}
        bottomSection={
          <div className="ButtonRow">
            <Button onClick={this.toggleShowAll}>
              {this.state.showAll ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        }
      />
    );
  }
}
