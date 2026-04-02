import type { Equipment, PagedResult } from '../../types/equipment';
import EquipmentStatusBadge from './EquipmentStatusBadge';
import Pagination from '../ui/Pagination';
import Spinner from '../ui/Spinner';

interface SortableColumn {
  key: string;
  label: string;
}

const SORTABLE_COLUMNS: SortableColumn[] = [
  { key: 'name', label: 'Nome' },
  { key: 'type', label: 'Tipo' },
];

interface EquipmentTableProps {
  data?: PagedResult<Equipment>;
  isLoading: boolean;
  page: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (col: string) => void;
  onPageChange: (page: number) => void;
  onEdit: (equipment: Equipment) => void;
  onDelete: (equipment: Equipment) => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

function SortIcon({ active, direction }: { active: boolean; direction?: 'asc' | 'desc' }) {
  return (
    <span className={`ml-1 inline-flex flex-col gap-px ${active ? 'text-cyan-400' : 'text-slate-600'}`}>
      <svg className={`h-2.5 w-2.5 transition-opacity ${active && direction === 'asc' ? 'opacity-100' : 'opacity-40'}`} viewBox="0 0 10 6" fill="currentColor">
        <path d="M5 0L10 6H0L5 0Z" />
      </svg>
      <svg className={`h-2.5 w-2.5 transition-opacity ${active && direction === 'desc' ? 'opacity-100' : 'opacity-40'}`} viewBox="0 0 10 6" fill="currentColor">
        <path d="M5 6L0 0H10L5 6Z" />
      </svg>
    </span>
  );
}

export default function EquipmentTable({
  data,
  isLoading,
  page,
  sortBy,
  sortDirection,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
}: EquipmentTableProps) {
  if (isLoading) {
    return (
      <div className="card flex items-center justify-center py-20">
        <Spinner size="lg" className="text-cyan-500" />
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="h-12 w-12 text-slate-700 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <p className="text-sm font-medium text-slate-500">Nenhum equipamento encontrado</p>
        <p className="text-xs text-slate-600 mt-1">Adicione um equipamento ou ajuste os filtros.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#1a2744]">
              {SORTABLE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort?.(col.key)}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 cursor-pointer select-none hover:text-slate-300 transition-colors"
                >
                  <span className="inline-flex items-center gap-0.5">
                    {col.label}
                    <SortIcon active={sortBy === col.key} direction={sortDirection} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Nº Série
              </th>
              <th
                onClick={() => onSort?.('acquisitionDate')}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 cursor-pointer select-none hover:text-slate-300 transition-colors"
              >
                <span className="inline-flex items-center gap-0.5">
                  Aquisição
                  <SortIcon active={sortBy === 'acquisitionDate'} direction={sortDirection} />
                </span>
              </th>
              <th
                onClick={() => onSort?.('status')}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 cursor-pointer select-none hover:text-slate-300 transition-colors"
              >
                <span className="inline-flex items-center gap-0.5">
                  Status
                  <SortIcon active={sortBy === 'status'} direction={sortDirection} />
                </span>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a2744]/60">
            {data.items.map((equipment) => (
              <tr
                key={equipment.id}
                className="group transition-colors duration-150 hover:bg-cyan-500/[0.03]"
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-200">{equipment.name}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-400">{equipment.type}</p>
                </td>
                <td className="px-4 py-3">
                  <code className="font-mono text-xs text-cyan-400/90 bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded">
                    {equipment.serialNumber}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <p className="font-mono text-xs text-slate-400">{formatDate(equipment.acquisitionDate)}</p>
                </td>
                <td className="px-4 py-3">
                  <EquipmentStatusBadge status={equipment.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(equipment)}
                      className="rounded-lg p-1.5 text-slate-600 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-150"
                      title="Editar"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(equipment)}
                      className="rounded-lg p-1.5 text-slate-600 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
                      title="Excluir"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#1a2744]">
        <p className="text-xs font-mono text-slate-600">
          {data.totalCount} {data.totalCount === 1 ? 'resultado' : 'resultados'}
        </p>
        <Pagination
          page={page}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          pageSize={data.pageSize}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
