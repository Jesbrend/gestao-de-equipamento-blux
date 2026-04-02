namespace EquipmentManagement.API.DTOs.Equipment;

public record EquipmentResponseDto(
    Guid Id,
    string Name,
    string Type,
    string SerialNumber,
    DateTime AcquisitionDate,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt);
