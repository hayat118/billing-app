import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="border-b border-gray-200 p-6">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;