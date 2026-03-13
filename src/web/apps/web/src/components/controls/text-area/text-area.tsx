'use client';

import type { InputEventHandler } from 'react';

import type { TextAreaProps as AriaTextAreaProps } from 'react-aria-components';
import { TextArea as AriaTextArea } from 'react-aria-components';
import { textAreaStyles } from './text-area.styles';

export type TextAreaProps = Omit<AriaTextAreaProps, 'className' | 'size' | 'style' | 'onKeyDown'>;

// TODO hide scroll bar till hover
const handleInput: InputEventHandler<HTMLTextAreaElement> = (e) => {
  const el = e.currentTarget;

  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
};

export function TextArea({ ...props }: TextAreaProps) {
  return <AriaTextArea {...props} onInput={handleInput} className={textAreaStyles()} />;
}
