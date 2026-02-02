'use client';

import React from 'react';

interface QuestionCardProps {
 number: number;
 title: string;
 subtitle?: string;
 required?: boolean;
 children: React.ReactNode;
}

export default function QuestionCard({
 number,
 title,
 subtitle,
 required = true,
 children,
}: QuestionCardProps) {
 return (
  <div className="question-card">
   <div className="flex items-start gap-3">
    <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
     {number}
    </span>
    <div className="flex-1">
     <h3 className="question-title">
      {title}
      {required && <span className="text-red-500 ml-1">*</span>}
     </h3>
     {subtitle && <p className="question-subtitle">{subtitle}</p>}
     <div className="mt-4">{children}</div>
    </div>
   </div>
  </div>
 );
}
