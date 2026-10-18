'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  actions?: React.ReactNode;
  secondaryFilters?: React.ReactNode;
  pageSize?: number;
  emptyTitle?: string;
  emptySubtitle?: string;
  isLoading?: boolean;
}

export function AdminTable<T>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = 'Search records...',
  searchFilter,
  actions,
  secondaryFilters,
  pageSize = 10,
  emptyTitle = 'No records found',
  emptySubtitle = 'Try adjusting your search criteria or filters.',
  isLoading = false,
}: AdminTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || !searchFilter) return data;
    return data.filter(row => searchFilter(row, searchQuery.trim().toLowerCase()));
  }, [data, searchQuery, searchFilter]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a: any, b: any) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      return sortOrder === 'asc' ? 1 : -1;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden">
      {/* Top Filter and Actions Bar */}
      <div className="p-3.5 sm:p-4 border-b border-gray-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
        <div className="flex flex-1 items-center gap-2.5 max-w-md">
          {searchFilter && (
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-lg py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#e8702a] focus:border-[#e8702a] transition-all"
              />
            </div>
          )}
          {secondaryFilters}
        </div>

        {actions && (
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-500 font-semibold tracking-wider uppercase text-[11px]">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`py-2.5 px-4 ${col.sortable ? 'cursor-pointer hover:text-gray-800 transition-colors' : ''} ${col.className || ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && sortKey === col.key && (
                      <span className="text-[#e8702a] font-bold">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-gray-400 text-xs">
                  <div className="inline-block w-5 h-5 border-2 border-gray-300 border-t-[#e8702a] rounded-full animate-spin mb-2" />
                  <div>Loading records...</div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-gray-500">
                  <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200/80 flex items-center justify-center mx-auto mb-2 text-gray-400">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-gray-800 text-xs mb-0.5">{emptyTitle}</p>
                  <p className="text-[11px] text-gray-400 max-w-sm mx-auto">{emptySubtitle}</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={keyExtractor(row)}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  {columns.map(col => (
                    <td key={col.key} className={`py-3 px-4 ${col.className || ''}`}>
                      {col.render ? col.render(row, idx) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && sortedData.length > 0 && (
        <div className="p-3 border-t border-gray-200/80 bg-gray-50/40 flex items-center justify-between text-xs text-gray-500">
          <div>
            Showing <span className="font-medium text-gray-800">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-medium text-gray-800">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            of <span className="font-medium text-gray-800">{sortedData.length}</span> results
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-gray-200 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <span className="px-2 text-[11px] text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-gray-200 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
