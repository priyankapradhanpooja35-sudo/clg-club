'use client';
import { useState, useMemo } from 'react';
import { TableSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { Search, ChevronDown, ChevronUp, Download, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchPlaceholder?: string;
  searchKey?: keyof T | ((row: T) => string);
  onBulkExport?: (selectedRows: T[]) => void;
  bulkActions?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

export default function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  data,
  loading,
  searchPlaceholder = 'Search records...',
  searchKey,
  onBulkExport,
  bulkActions,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no records to display.',
  pageSize = 10,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((row) => {
      if (typeof searchKey === 'function') {
        return searchKey(row).toLowerCase().includes(q);
      }
      if (searchKey && typeof row[searchKey] === 'string') {
        return (row[searchKey] as string).toLowerCase().includes(q);
      }
      return JSON.stringify(row).toLowerCase().includes(q);
    });
  }, [data, query, searchKey]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a: any, b: any) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const getRowId = (row: T) => (row._id || row.id || JSON.stringify(row)) as string;

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map(getRowId)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const exportCSV = () => {
    const selectedRows = data.filter((r) => selectedIds.has(getRowId(r)));
    const rowsToExport = selectedRows.length > 0 ? selectedRows : sortedData;
    if (onBulkExport) {
      onBulkExport(rowsToExport);
      return;
    }
    const headers = columns.map((c) => c.header).join(',');
    const csvContent = [
      headers,
      ...rowsToExport.map((row: any) =>
        columns
          .map((c) => {
            const val = row[c.key];
            return typeof val === 'object' ? `"${JSON.stringify(val).replace(/"/g, '""')}"` : `"${val ?? ''}"`;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${Date.now()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 pl-10 text-sm text-[var(--foreground)] focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {selectedIds.size > 0 && bulkActions}
          <Button variant="secondary" size="sm" onClick={exportCSV} className="gap-1.5">
            <Download className="w-4 h-4" /> Export CSV ({selectedIds.size > 0 ? selectedIds.size : sortedData.length})
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--muted)]/60 text-gray-500 uppercase tracking-wider font-semibold border-b border-[var(--border)]">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  />
                </th>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    onClick={() => handleSort(c.key, c.sortable)}
                    className={`p-3.5 select-none ${c.sortable ? 'cursor-pointer hover:text-[var(--foreground)]' : ''}`}
                  >
                    <div className="flex items-center gap-1">
                      {c.header}
                      {c.sortable && sortKey === c.key && (
                        sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center">
                    <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const id = getRowId(row);
                  const isSelected = selectedIds.has(id);
                  return (
                    <tr
                      key={id}
                      className={`hover:bg-[var(--muted)]/40 transition-colors ${isSelected ? 'bg-violet-50/40 dark:bg-violet-950/20' : ''}`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(id)}
                          className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        />
                      </td>
                      {columns.map((c) => (
                        <td key={c.key} className="p-3.5 font-medium text-[var(--foreground)]">
                          {c.render ? c.render(row) : (row as any)[c.key]}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3.5 border-t border-[var(--border)] bg-[var(--muted)]/30 text-xs text-gray-500">
            <span>
              Page {currentPage} of {totalPages} ({sortedData.length} records)
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
