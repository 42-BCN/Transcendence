'use client';

import { Search } from 'lucide-react';
import { TextField, type TextFieldProps } from '../text-field';

export type SearchInputProps = Omit<TextFieldProps, 'icon'>;

export function SearchInput(props: SearchInputProps) {
  return <TextField {...props} icon={<Search size={18} />} />;
}
