'use client';

import React from 'react';
import clsx from 'clsx';

interface ProgressBarProps {
 current: number;
 total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
 const percentage = Math.round((current / total) * 100);

 return (
  <div className="w-full">
   <div className="flex justify-between mb-2">
    <span className="text-sm font-medium text-gray-700">Progress Survei</span>
    <span className="text-sm font-medium text-gray-700">{percentage}%</span>
   </div>
   <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
     className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
     style={{ width: `${percentage}%` }}
    />
   </div>
   <p className="text-xs text-gray-500 mt-1">
    Bagian {current} dari {total}
   </p>
  </div>
 );
}
