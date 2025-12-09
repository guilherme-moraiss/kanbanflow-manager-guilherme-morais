import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 animate-shimmer"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-shimmer"></div>
      </div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2 animate-shimmer"></div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4 animate-shimmer"></div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-shimmer"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16 animate-shimmer"></div>
        </div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-12 animate-shimmer"></div>
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              {[1, 2, 3, 4, 5].map(i => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {[1, 2, 3, 4, 5].map(j => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SkeletonStats: React.FC = () => {
  return (
    <div className="grid grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-2"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonKanbanBoard: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48 animate-pulse"></div>
        </div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
      </div>

      <SkeletonStats />

      <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 my-6 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-3"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {[1, 2, 3].map(col => (
          <div key={col} className="flex-1 min-w-[300px] bg-slate-100/80 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2].map(card => (
                <SkeletonCard key={card} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

