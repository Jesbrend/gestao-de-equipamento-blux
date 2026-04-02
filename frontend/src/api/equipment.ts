import type {
  Equipment,
  EquipmentCreateRequest,
  EquipmentQuery,
  EquipmentUpdateRequest,
  PagedResult,
} from '../types/equipment';
import apiClient from './client';

const buildParams = (query: EquipmentQuery) => {
  const params: Record<string, string | number> = {};
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;
  if (query.search) params.search = query.search;
  if (query.type) params.type = query.type;
  if (query.status) params.status = query.status;
  if (query.sortBy) params.sortBy = query.sortBy;
  if (query.sortDirection) params.sortDirection = query.sortDirection;
  return params;
};

export const equipmentApi = {
  getAll: (query: EquipmentQuery = {}) =>
    apiClient
      .get<PagedResult<Equipment>>('/equipment', { params: buildParams(query) })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Equipment>(`/equipment/${id}`).then((r) => r.data),

  create: (data: EquipmentCreateRequest) =>
    apiClient.post<Equipment>('/equipment', data).then((r) => r.data),

  update: (id: string, data: EquipmentUpdateRequest) =>
    apiClient.put<Equipment>(`/equipment/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/equipment/${id}`).then((r) => r.data),

  downloadCsv: (query: EquipmentQuery = {}) =>
    apiClient.get('/equipment/report/csv', {
      params: buildParams(query),
      responseType: 'blob',
    }),

  downloadPdf: (query: EquipmentQuery = {}) =>
    apiClient.get('/equipment/report/pdf', {
      params: buildParams(query),
      responseType: 'blob',
    }),
};
