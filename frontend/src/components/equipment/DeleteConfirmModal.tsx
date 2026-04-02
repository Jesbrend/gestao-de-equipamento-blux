import type { Equipment } from '../../types/equipment';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface DeleteConfirmModalProps {
  equipment: Equipment | null;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({
  equipment,
  isLoading,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={!!equipment}
      onClose={onClose}
      title="Confirmar exclusão"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            Excluir
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm text-slate-300">
            Tem certeza que deseja excluir{' '}
            <span className="font-semibold text-slate-100">{equipment?.name}</span>?
          </p>
          <p className="text-xs text-slate-500 mt-1">Esta ação não pode ser desfeita.</p>
        </div>
      </div>
    </Modal>
  );
}
