import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`}></div>
    );
};

export const MapSkeleton = () => {
    return (
        <div className="w-full h-full min-h-[400px] bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse flex items-center justify-center">
            <p className="text-gray-400 dark:text-gray-600 font-medium">Loading Crowd Data...</p>
        </div>
    );
};
