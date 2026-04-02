export type EquipmentStatus = 'Active' | 'Inactive' | 'UnderMaintenance' | 'Decommissioned';

export interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  acquisitionDate: string;
  status: EquipmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentCreateRequest {
  name: string;
  type: string;
  serialNumber: string;
  acquisitionDate: string;
  status: EquipmentStatus;
}

export interface EquipmentUpdateRequest {
  name: string;
  type: string;
  serialNumber: string;
  acquisitionDate: string;
  status: EquipmentStatus;
}

export interface EquipmentQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  Active: 'Ativo',
  Inactive: 'Inativo',
  UnderMaintenance: 'Em Manutenção',
  Decommissioned: 'Desativado',
};

export const EQUIPMENT_STATUS_OPTIONS: { value: EquipmentStatus; label: string }[] = [
  { value: 'Active', label: 'Ativo' },
  { value: 'Inactive', label: 'Inativo' },
  { value: 'UnderMaintenance', label: 'Em Manutenção' },
  { value: 'Decommissioned', label: 'Desativado' },
];
