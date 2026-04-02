import { useState, useCallback } from 'react';
import type { Equipment, EquipmentQuery } from '../../types/equipment';
import {
  useEquipmentList,
  useCreateEquipment,
  useUpdateEquipment,
  useDeleteEquipment,
} from '../../hooks/useEquipment';
import type { EquipmentFormValues } from '../../schemas/equipmentSchemas';
import AppLayout from '../../components/layout/AppLayout';
import EquipmentTable from '../../components/equipment/EquipmentTable';
import EquipmentFilters from '../../components/equipment/EquipmentFilters';
import EquipmentForm from '../../components/equipment/EquipmentForm';
import DeleteConfirmModal from '../../components/equipment/DeleteConfirmModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { getApiErrorMessage } from '../../utils/apiError';

const DEFAULT_QUERY: EquipmentQuery = {
  page: 1,
  pageSize: 6,
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

export default function EquipmentPage() {
  const [query, setQuery] = useState<EquipmentQuery>(DEFAULT_QUERY);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null);

  const { data, isLoading } = useEquipmentList(query);
  const { mutate: create, isPending: isCreating } = useCreateEquipment();
  const { mutate: update, isPending: isUpdating } = useUpdateEquipment();
  const { mutate: deleteEquipment, isPending: isDeleting } = useDeleteEquipment();

  const handleFiltersChange = useCallback((newFilters: EquipmentQuery) => {
    setQuery((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  }, []);

  const handleSort = useCallback((col: string) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      sortBy: col,
      sortDirection: prev.sortBy === col && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleOpenCreate = () => {
    setEditingEquipment(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEquipment(null);
  };

  const handleFormSubmit = (values: EquipmentFormValues) => {
    if (editingEquipment) {
      update(
        { id: editingEquipment.id, data: values },
        {
          onSuccess: () => {
            toast.success('Equipamento atualizado com sucesso!');
            handleCloseForm();
          },
          onError: (error: unknown) =>
            toast.error(getApiErrorMessage(error, 'Erro ao atualizar equipamento.')),
        }
      );
    } else {
      create(values, {
        onSuccess: () => {
          toast.success('Equipamento criado com sucesso!');
          handleCloseForm();
        },
        onError: (error: unknown) =>
          toast.error(getApiErrorMessage(error, 'Erro ao criar equipamento.')),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingEquipment) return;
    deleteEquipment(deletingEquipment.id, {
      onSuccess: () => {
        toast.success('Equipamento excluído com sucesso!');
        setDeletingEquipment(null);
      },
      onError: () => toast.error('Erro ao excluir equipamento.'),
    });
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Equipamentos</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {data ? (
                <>
                  <span className="font-mono text-slate-400">{data.totalCount}</span>
                  {' '}registros
                  {data && <span className="text-slate-600"> • atualizado agora</span>}
                </>
              ) : (
                'carregando...'
              )}
            </p>
          </div>
          <Button
            onClick={handleOpenCreate}
            leftIcon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Novo equipamento
          </Button>
        </div>

        {/* Filters */}
        <EquipmentFilters filters={query} onChange={handleFiltersChange} />

        {/* Table */}
        <EquipmentTable
          data={data}
          isLoading={isLoading}
          page={query.page ?? 1}
          sortBy={query.sortBy}
          sortDirection={query.sortDirection}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onEdit={handleOpenEdit}
          onDelete={setDeletingEquipment}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingEquipment ? 'Editar equipamento' : 'Novo equipamento'}
        size="lg"
      >
        <EquipmentForm
          defaultValues={editingEquipment ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          isLoading={isCreating || isUpdating}
        />
      </Modal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        equipment={deletingEquipment}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingEquipment(null)}
      />
    </AppLayout>
  );
}
