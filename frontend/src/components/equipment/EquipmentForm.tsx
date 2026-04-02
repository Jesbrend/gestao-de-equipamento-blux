import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { equipmentSchema, type EquipmentFormValues } from '../../schemas/equipmentSchemas';
import type { Equipment } from '../../types/equipment';
import { EQUIPMENT_STATUS_OPTIONS } from '../../types/equipment';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface EquipmentFormProps {
  defaultValues?: Equipment;
  onSubmit: (data: EquipmentFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function EquipmentForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: EquipmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          type: defaultValues.type,
          serialNumber: defaultValues.serialNumber,
          acquisitionDate: defaultValues.acquisitionDate.split('T')[0],
          status: defaultValues.status,
        }
      : { status: 'Active' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome"
        required
        placeholder="Ex: Notebook Dell XPS 15"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Tipo"
        required
        placeholder="Ex: Computador, Monitor, Impressora..."
        error={errors.type?.message}
        {...register('type')}
      />
      <Input
        label="Número de Série"
        required
        placeholder="Ex: SN-DELL-001"
        error={errors.serialNumber?.message}
        {...register('serialNumber')}
      />
      <Input
        label="Data de Aquisição"
        type="date"
        required
        max={new Date().toISOString().split('T')[0]}
        error={errors.acquisitionDate?.message}
        {...register('acquisitionDate')}
      />
      <Select
        label="Status"
        required
        options={EQUIPMENT_STATUS_OPTIONS}
        error={errors.status?.message}
        {...register('status')}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? 'Salvar alterações' : 'Criar equipamento'}
        </Button>
      </div>
    </form>
  );
}
