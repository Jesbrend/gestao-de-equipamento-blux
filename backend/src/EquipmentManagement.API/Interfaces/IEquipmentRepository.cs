using EquipmentManagement.API.Domain.Entities;
using EquipmentManagement.API.DTOs.Equipment;

namespace EquipmentManagement.API.Interfaces;

public interface IEquipmentRepository
{
    Task<PagedResultDto<Equipment>> GetPagedAsync(EquipmentQueryDto query, CancellationToken cancellationToken = default);
    Task<Equipment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> SerialNumberExistsAsync(string serialNumber, Guid? excludeId = null, CancellationToken cancellationToken = default);
    Task<Equipment> CreateAsync(Equipment equipment, CancellationToken cancellationToken = default);
    Task<Equipment> UpdateAsync(Equipment equipment, CancellationToken cancellationToken = default);
    Task DeleteAsync(Equipment equipment, CancellationToken cancellationToken = default);
    Task<IEnumerable<Equipment>> GetAllForReportAsync(EquipmentQueryDto query, CancellationToken cancellationToken = default);
}
