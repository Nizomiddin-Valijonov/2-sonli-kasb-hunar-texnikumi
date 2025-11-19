"use client";

import React from "react";

interface LoadingStateProps {
  message: string;
  skeletonCount?: number;
  skeletonClassName?: string;
  bgClassName?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  skeletonCount = 4,
  skeletonClassName = "w-48 h-56 bg-gray-200 rounded-2xl animate-pulse",
  bgClassName = "py-24 bg-gray-50 text-center",
}) => {
  return (
    <section className={bgClassName}>
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">{message}</h2>
      <div className="flex justify-center gap-6 flex-wrap">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={`skeleton-${i}`} className={skeletonClassName} />
        ))}
      </div>
    </section>
  );
};

export default LoadingState;
