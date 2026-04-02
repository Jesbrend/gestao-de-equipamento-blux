import { useCallback, useRef, useEffect, useState } from 'react';
import type { EquipmentQuery } from '../../types/equipment';

interface EquipmentFiltersProps {
  filters: EquipmentQuery;
  onChange: (filters: EquipmentQuery) => void;
}

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

export default function EquipmentFilters({ filters, onChange }: EquipmentFiltersProps) {
  const update = useCallback(
    (patch: Partial<EquipmentQuery>) => onChange({ ...filters, ...patch, page: 1 }),
    [filters, onChange]
  );

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nome, tipo ou série..."
          value={filters.search ?? ''}
          onChange={(e) => update({ search: e.target.value })}
          className="input-base pl-9"
        />
      </div>
      <StatusDropdown
        value={filters.status ?? ''}
        onChange={(v) => update({ status: v })}
      />
    </div>
  );
}
