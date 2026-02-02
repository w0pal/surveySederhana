'use client';

import React from 'react';

interface TextFieldProps {
 value: string;
 onChange: (value: string) => void;
 placeholder?: string;
 type?: 'text' | 'tel' | 'email' | 'number';
 multiline?: boolean;
 rows?: number;
}

export default function TextField({
 value,
 onChange,
 placeholder,
 type = 'text',
 multiline = false,
 rows = 4,
}: TextFieldProps) {
 if (multiline) {
  return (
   <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="input-field resize-none"
   />
  );
 }

 return (
  <input
   type={type}
   value={value}
   onChange={(e) => onChange(e.target.value)}
   placeholder={placeholder}
   className="input-field"
  />
 );
}
