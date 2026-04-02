import { useState, useRef, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import EquipmentStatusBadge from '../../components/equipment/EquipmentStatusBadge';
import Spinner from '../../components/ui/Spinner';
import { toast } from '../../components/ui/Toast';
import { useEquipmentList, useDownloadReport } from '../../hooks/useEquipment';
import type { EquipmentQuery } from '../../types/equipment';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'Active', label: 'Ativo' },
  { value: 'Inactive', label: 'Inativo' },
  { value: 'UnderMaintenance', label: 'Manutenção' },
  { value: 'Decommissioned', label: 'Desativado' },
];

function StatusDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = STATUS_OPTIONS.find((o) => o.value === value) ?? STATUS_OPTIONS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-[#1a2744] bg-[#0d1421] px-3 py-2 text-sm text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-all duration-150 min-w-[120px]"
      >
        <span className="flex-1 text-left">{selected.label}</span>
        <svg
          className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-20 w-44 rounded-xl border border-[#1e2d40] bg-[#0d1421] py-1 shadow-2xl shadow-black/50">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-left transition-colors hover:bg-cyan-500/5 hover:text-cyan-400"
            >
              <span className={`h-4 w-4 flex-shrink-0 ${opt.value === value ? 'text-cyan-400' : 'text-transparent'}`}>
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                </svg>
              </span>
              <span className={opt.value === value ? 'text-slate-200' : 'text-slate-400'}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const query: EquipmentQuery = {
    page: 1,
    pageSize: 100,
    sortBy: 'name',
    sortDirection: 'asc',
    status: statusFilter || undefined,
  };

  const { data, isLoading } = useEquipmentList(query);
  const { csvMutation, pdfMutation } = useDownloadReport();

  const handleDownloadCsv = () => {
    csvMutation.mutate(query, {
      onError: () => toast.error('Erro ao gerar relatório CSV.'),
    });
  };

  const handleDownloadPdf = () => {
    pdfMutation.mutate(query, {
      onError: () => toast.error('Erro ao gerar relatório PDF.'),
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Relatórios</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              exportação de dados
              {data && (
                <>
                  {' '}•{' '}
                  <span className="font-mono text-slate-400">{data.totalCount}</span> registros
                </>
              )}
            </p>
          </div>
          <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
        </div>

        {/* Export cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* CSV */}
          <button
            onClick={handleDownloadCsv}
            disabled={csvMutation.isPending}
            className="card group flex items-center gap-4 p-5 text-left transition-all duration-200 hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/15 transition-colors">
              <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200">Exportar CSV</p>
              <p className="text-xs text-slate-500 mt-0.5">.csv • dados filtrados</p>
            </div>
            <div className="flex-shrink-0 text-slate-600 group-hover:text-emerald-400 transition-colors">
              {csvMutation.isPending ? (
                <Spinner size="sm" className="text-emerald-400" />
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
            </div>
          </button>

          {/* PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={pdfMutation.isPending}
            className="card group flex items-center gap-4 p-5 text-left transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/[0.03] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 group-hover:bg-red-500/15 transition-colors">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200">Exportar PDF</p>
              <p className="text-xs text-slate-500 mt-0.5">.pdf • relatório formatado</p>
            </div>
            <div className="flex-shrink-0 text-slate-600 group-hover:text-red-400 transition-colors">
              {pdfMutation.isPending ? (
                <Spinner size="sm" className="text-red-400" />
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Preview table */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a2744]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-500 font-mono">
              preview
              {data && (
                <span className="ml-2 text-slate-600">
                  • {data.totalCount} {data.totalCount === 1 ? 'item' : 'itens'}
                </span>
              )}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" className="text-cyan-500" />
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-slate-500">Nenhum equipamento encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-[#1a2744]">
                    {['Nome', 'Tipo', 'Status', 'Data de Aquisição'].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a2744]/60">
                  {data.items.map((equipment) => (
                    <tr key={equipment.id} className="hover:bg-cyan-500/[0.03] transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-slate-200">{equipment.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{equipment.type}</td>
                      <td className="px-4 py-3">
                        <EquipmentStatusBadge status={equipment.status} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">
                        {formatDate(equipment.acquisitionDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
