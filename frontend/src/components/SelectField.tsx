'use client';

import React from 'react';
import { Option } from '@/lib/surveyData';

interface SelectFieldProps {
 options: Option[];
 value: string;
 onChange: (value: string) => void;
 placeholder?: string;
 disabled?: boolean;
}

export default function SelectField({
 options,
 value,
 onChange,
 placeholder = 'Pilih...',
 disabled = false,
}: SelectFieldProps) {
 return (
  <select
   value={value}
   onChange={(e) => onChange(e.target.value)}
   disabled={disabled}
   className="input-field"
  >
   <option value="">{placeholder}</option>
   {options.map((option) => (
    <option key={option.value} value={option.value}>
     {option.label}
    </option>
   ))}
  </select>
 );
}
