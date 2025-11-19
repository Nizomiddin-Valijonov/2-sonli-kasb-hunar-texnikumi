"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <section className="py-32 bg-gray-100 text-center">
      <div className="flex flex-col items-center gap-3">
        <AlertCircle size={48} className="text-gray-500" />
        <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>
    </section>
  );
};

export default EmptyState;
