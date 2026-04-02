interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'yellow' | 'blue' | 'gray';
}

const variants = {
  green: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  red: 'bg-red-500/10 text-red-400 border border-red-500/20',
  yellow: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  blue: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  gray: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
};

export default function Badge({ children, variant = 'gray' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
