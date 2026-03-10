import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
  );
};

export const ParcelCardSkeleton = () => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-slate-900 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 bg-slate-800" />
          <Skeleton className="h-8 w-48 bg-slate-800" />
        </div>
        <div className="flex items-center gap-4">
          <div className="space-y-2 hidden md:block">
            <Skeleton className="h-3 w-24 bg-slate-800" />
            <Skeleton className="h-6 w-32 bg-slate-800" />
          </div>
          <Skeleton className="w-16 h-16 rounded-2xl bg-slate-800" />
        </div>
      </div>
      <div className="p-8 space-y-10">
        <Skeleton className="h-4 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminParcelDetailsSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="w-40 h-12 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    </div>
  );
};
