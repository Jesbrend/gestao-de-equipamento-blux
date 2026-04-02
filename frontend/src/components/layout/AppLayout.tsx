import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { ToastContainer } from '../ui/Toast';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#080c14]">
      <Sidebar />
      <main className="flex-1 ml-56 min-h-screen bg-dots">
        <div className="p-8">{children}</div>
      </main>
      <ToastContainer />
    </div>
  );
}
