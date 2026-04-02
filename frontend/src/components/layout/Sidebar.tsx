import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  {
    to: '/',
    label: 'Equipamentos',
    icon: (active: boolean) => (
      <svg
        className={`h-[18px] w-[18px] flex-shrink-0 ${active ? 'text-cyan-400' : 'text-slate-500'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    to: '/reports',
    label: 'Relatórios',
    icon: (active: boolean) => (
      <svg
        className={`h-[18px] w-[18px] flex-shrink-0 ${active ? 'text-cyan-400' : 'text-slate-500'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-56 flex-col bg-[#0a0d14] border-r border-[#1a2744]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1a2744]">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/25">
          <svg className="h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <span className="text-lg font-bold text-white tracking-wide">Blux</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:bg-[#111827] hover:text-slate-200 border border-transparent'
              }`}
            >
              {item.icon(isActive)}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-[#1a2744] p-4 space-y-3">
        {user && (
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-400 transition-colors duration-150"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sair
        </button>
      </div>
    </aside>
  );
}
