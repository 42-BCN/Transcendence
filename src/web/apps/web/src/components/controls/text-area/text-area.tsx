'use client';

import type { InputEventHandler } from 'react';

import type { TextAreaProps as AriaTextAreaProps } from 'react-aria-components';
import { TextArea as AriaTextArea } from 'react-aria-components';
import { textAreaStyles } from './text-area.styles';

export type TextAreaProps = Omit<AriaTextAreaProps, 'size' | 'style' | 'onKeyDown' | 'onInput'> & {
  className: string;
};

const handleInput: InputEventHandler<HTMLTextAreaElement> = (e) => {
  const el = e.currentTarget;

  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight + 4}px`;
};

export function TextArea({ ...props }: TextAreaProps) {
  return (
    <AriaTextArea {...props} onInput={handleInput} className={textAreaStyles(props.className)} />
  );
}
