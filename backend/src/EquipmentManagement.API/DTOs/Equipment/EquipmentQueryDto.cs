namespace EquipmentManagement.API.DTOs.Equipment;

public record EquipmentQueryDto
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public string? Search { get; init; }
    public string? Type { get; init; }
    public string? Status { get; init; }
    public string SortBy { get; init; } = "CreatedAt";
    public string SortDirection { get; init; } = "desc";
}
