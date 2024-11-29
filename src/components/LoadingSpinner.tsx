import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-12">
    <div className="relative">
      <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
      <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin" style={{ animationDelay: '-0.5s' }}></div>
    </div>
  </div>
);

export default LoadingSpinner;