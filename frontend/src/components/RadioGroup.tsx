'use client';

import React from 'react';
import clsx from 'clsx';
import { Option } from '@/lib/surveyData';

interface RadioGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  columns?: 1 | 2 | 3;
}

export default function RadioGroup({
  options,
  value,
  onChange,
  name,
  columns = 1,
}: RadioGroupProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }[columns];

  return (
    <div className={clsx('grid gap-3', gridClass)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={clsx(
            'radio-option flex items-start',
            value === option.value && 'selected'
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 mt-0.5 text-primary-600 border-gray-300 focus:ring-primary-500 flex-shrink-0"
          />
          <span className="ml-3 text-sm text-gray-700 leading-relaxed min-w-0 flex-1" style={{ wordBreak: 'break-word' }}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
