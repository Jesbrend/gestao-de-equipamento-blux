import { z } from 'zod';

const validStatuses = ['Active', 'Inactive', 'UnderMaintenance', 'Decommissioned'] as const;

const today = new Date();
today.setHours(23, 59, 59, 999);

export const equipmentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome deve ter no máximo 200 caracteres'),
  type: z.string().min(1, 'Tipo é obrigatório').max(100, 'Tipo deve ter no máximo 100 caracteres'),
  serialNumber: z
    .string()
    .min(1, 'Número de série é obrigatório')
    .max(100, 'Número de série deve ter no máximo 100 caracteres'),
  acquisitionDate: z
    .string()
    .min(1, 'Data de aquisição é obrigatória')
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date <= today;
      },
      'Data de aquisição não pode ser futura'
    ),
  status: z.enum(validStatuses, { errorMap: () => ({ message: 'Status inválido' }) }),
});

export type EquipmentFormValues = z.infer<typeof equipmentSchema>;
