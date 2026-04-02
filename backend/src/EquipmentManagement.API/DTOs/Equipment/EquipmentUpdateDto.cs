namespace EquipmentManagement.API.DTOs.Equipment;

public record EquipmentUpdateDto(
    string Name,
    string Type,
    string SerialNumber,
    DateTime AcquisitionDate,
    string Status);
