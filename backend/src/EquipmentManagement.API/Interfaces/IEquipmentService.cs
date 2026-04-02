using EquipmentManagement.API.DTOs.Equipment;

namespace EquipmentManagement.API.Interfaces;

public interface IEquipmentService
{
    Task<PagedResultDto<EquipmentResponseDto>> GetPagedAsync(EquipmentQueryDto query, CancellationToken cancellationToken = default);
    Task<EquipmentResponseDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<EquipmentResponseDto> CreateAsync(EquipmentCreateDto dto, CancellationToken cancellationToken = default);
    Task<EquipmentResponseDto> UpdateAsync(Guid id, EquipmentUpdateDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
