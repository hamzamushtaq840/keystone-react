import React from 'react';

const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-400 rounded w-3/4"></div>
      <div className="h-4 mt-2 bg-gray-400 rounded w-1/2"></div>
    </div>
  );
  

export default SkeletonLoader;
