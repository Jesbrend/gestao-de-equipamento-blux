using EquipmentManagement.API.DTOs.Equipment;

namespace EquipmentManagement.API.Interfaces;

public interface IReportService
{
    Task<byte[]> GenerateCsvAsync(EquipmentQueryDto query, CancellationToken cancellationToken = default);
    Task<byte[]> GeneratePdfAsync(EquipmentQueryDto query, CancellationToken cancellationToken = default);
}
