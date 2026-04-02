import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { equipmentApi } from '../api/equipment';
import type {
  EquipmentCreateRequest,
  EquipmentQuery,
  EquipmentUpdateRequest,
} from '../types/equipment';

export const equipmentKeys = {
  all: ['equipment'] as const,
  lists: () => [...equipmentKeys.all, 'list'] as const,
  list: (params: EquipmentQuery) => [...equipmentKeys.lists(), params] as const,
  detail: (id: string) => [...equipmentKeys.all, id] as const,
};

export function useEquipmentList(query: EquipmentQuery = {}) {
  return useQuery({
    queryKey: equipmentKeys.list(query),
    queryFn: () => equipmentApi.getAll(query),
    placeholderData: keepPreviousData,
  });
}

export function useEquipmentById(id: string) {
  return useQuery({
    queryKey: equipmentKeys.detail(id),
    queryFn: () => equipmentApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EquipmentCreateRequest) => equipmentApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: equipmentKeys.all }),
  });
}

export function useUpdateEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EquipmentUpdateRequest }) =>
      equipmentApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: equipmentKeys.all }),
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => equipmentApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: equipmentKeys.all }),
  });
}

export function useDownloadReport() {
  const download = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const csvMutation = useMutation({
    mutationFn: (query: EquipmentQuery) => equipmentApi.downloadCsv(query),
    onSuccess: (response) => {
      download(response.data, `equipamentos_${Date.now()}.csv`);
    },
  });

  const pdfMutation = useMutation({
    mutationFn: (query: EquipmentQuery) => equipmentApi.downloadPdf(query),
    onSuccess: (response) => {
      download(response.data, `equipamentos_${Date.now()}.pdf`);
    },
  });

  return { csvMutation, pdfMutation };
}
