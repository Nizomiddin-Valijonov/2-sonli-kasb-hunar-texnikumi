"use client";

import React from "react";
import { WifiOff } from "lucide-react";

interface ErrorStateProps {
  title: string;
  description: string;
  retryText: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  retryText,
  onRetry,
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <section className="py-32 bg-gradient-to-b from-red-50 to-white text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-red-100 text-red-600 p-6 rounded-full">
          <WifiOff size={48} />
        </div>
        <h2 className="text-3xl font-bold text-red-700">{title}</h2>
        <p className="text-gray-600 max-w-md mx-auto">{description}</p>
        <button
          onClick={handleRetry}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          {retryText}
        </button>
      </div>
    </section>
  );
};

export default ErrorState;
