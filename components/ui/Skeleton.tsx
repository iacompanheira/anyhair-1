
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number, columns: number }> = ({ rows = 3, columns }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex space-x-4 items-center">
                    {Array.from({ length: columns }).map((_, j) => (
                        <Skeleton key={j} className={`h-8 flex-1 ${j === 0 ? 'w-1/4' : ''} ${j === columns - 1 ? 'w-1/6' : ''}`} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            ))}
        </div>
    );
};
