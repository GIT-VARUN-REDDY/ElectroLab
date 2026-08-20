import React from 'react';

const SkeletonCard = () => (
  <div className="card-glass rounded-2xl overflow-hidden" aria-hidden="true">
    <div className="shimmer h-48 w-full" />
    <div className="p-5 space-y-3">
      <div className="shimmer h-4 w-3/4 rounded-full" />
      <div className="shimmer h-3 w-full rounded-full" />
      <div className="shimmer h-3 w-2/3 rounded-full" />
      <div className="flex gap-2 mt-4">
        <div className="shimmer h-6 w-16 rounded-full" />
        <div className="shimmer h-6 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;