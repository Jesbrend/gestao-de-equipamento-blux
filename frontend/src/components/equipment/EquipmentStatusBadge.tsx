import type { EquipmentStatus } from '../../types/equipment';

const config: Record<EquipmentStatus, { dot: string; text: string; bg: string; label: string }> = {
  Active: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    label: 'Ativo',
  },
  Inactive: {
    dot: 'bg-slate-500',
    text: 'text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/20',
    label: 'Inativo',
  },
  UnderMaintenance: {
    dot: 'bg-amber-500',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    label: 'Manutenção',
  },
  Decommissioned: {
    dot: 'bg-red-500',
    text: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    label: 'Desativado',
  },
};

export default function EquipmentStatusBadge({ status }: { status: EquipmentStatus }) {
  const { dot, text, bg, label } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}
    >
      <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
