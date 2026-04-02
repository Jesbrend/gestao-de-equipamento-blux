namespace EquipmentManagement.API.DTOs.Equipment;

public record EquipmentCreateDto(
    string Name,
    string Type,
    string SerialNumber,
    DateTime AcquisitionDate,
    string Status);
