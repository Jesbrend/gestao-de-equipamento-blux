using EquipmentManagement.API.Domain.Enums;

namespace EquipmentManagement.API.Domain.Entities;

public class Equipment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public DateTime AcquisitionDate { get; set; }
    public EquipmentStatus Status { get; set; } = EquipmentStatus.Active;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
