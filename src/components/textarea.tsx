import * as React from 'react';
import { joinClassName } from 'join-string';
import TextAreaAutosize, {
  TextareaAutosizeProps
} from 'react-textarea-autosize';
import { callAll } from '../lib';

export interface TextAreaProps extends TextareaAutosizeProps {
  onChangeValue?: (value: string) => void;
}
export const TextArea: React.FunctionComponent<TextAreaProps> = ({
  ref,
  className,
  onChange,
  onChangeValue,
  ...props
}) => (
  <TextAreaAutosize
    className={joinClassName('form-control', className)}
    onChange={callAll(
      onChange,
      onChangeValue && (ev => onChangeValue(ev.target.value))
    )}
    {...props}
  />
);
