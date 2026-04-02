using EquipmentManagement.API.Data;
using EquipmentManagement.API.Domain.Entities;
using EquipmentManagement.API.Domain.Enums;
using EquipmentManagement.API.DTOs.Equipment;
using EquipmentManagement.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EquipmentManagement.API.Repositories;

public class EquipmentRepository(AppDbContext context) : IEquipmentRepository
{
    public async Task<PagedResultDto<Equipment>> GetPagedAsync(EquipmentQueryDto query, CancellationToken cancellationToken = default)
    {
        var dbQuery = BuildBaseQuery(query);

        var totalCount = await dbQuery.CountAsync(cancellationToken);
        var items = await ApplySortingAndPaging(dbQuery, query)
            .ToListAsync(cancellationToken);

        return new PagedResultDto<Equipment>(items, totalCount, query.Page, query.PageSize);
    }

    public async Task<IEnumerable<Equipment>> GetAllForReportAsync(EquipmentQueryDto query, CancellationToken cancellationToken = default)
    {
        var dbQuery = BuildBaseQuery(query);
        return await ApplySorting(dbQuery, query).ToListAsync(cancellationToken);
    }

    public async Task<Equipment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await context.Equipments.FindAsync([id], cancellationToken);

    public async Task<bool> SerialNumberExistsAsync(string serialNumber, Guid? excludeId = null, CancellationToken cancellationToken = default)
        => await context.Equipments.AnyAsync(e =>
            e.SerialNumber == serialNumber && (excludeId == null || e.Id != excludeId),
            cancellationToken);

    public async Task<Equipment> CreateAsync(Equipment equipment, CancellationToken cancellationToken = default)
    {
        context.Equipments.Add(equipment);
        await context.SaveChangesAsync(cancellationToken);
        return equipment;
    }

    public async Task<Equipment> UpdateAsync(Equipment equipment, CancellationToken cancellationToken = default)
    {
        context.Equipments.Update(equipment);
        await context.SaveChangesAsync(cancellationToken);
        return equipment;
    }

    public async Task DeleteAsync(Equipment equipment, CancellationToken cancellationToken = default)
    {
        context.Equipments.Remove(equipment);
        await context.SaveChangesAsync(cancellationToken);
    }

    private IQueryable<Equipment> BuildBaseQuery(EquipmentQueryDto query)
    {
        var dbQuery = context.Equipments.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.ToLower();
            dbQuery = dbQuery.Where(e =>
                e.Name.ToLower().Contains(search) ||
                e.SerialNumber.ToLower().Contains(search) ||
                e.Type.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(query.Type))
            dbQuery = dbQuery.Where(e => e.Type.ToLower() == query.Type.ToLower());

        if (!string.IsNullOrWhiteSpace(query.Status) &&
            Enum.TryParse<EquipmentStatus>(query.Status, ignoreCase: true, out var status))
            dbQuery = dbQuery.Where(e => e.Status == status);

        return dbQuery;
    }

    private static IQueryable<Equipment> ApplySorting(IQueryable<Equipment> query, EquipmentQueryDto dto)
    {
        var descending = dto.SortDirection.Equals("desc", StringComparison.OrdinalIgnoreCase);
        return dto.SortBy.ToLower() switch
        {
            "name" => descending ? query.OrderByDescending(e => e.Name) : query.OrderBy(e => e.Name),
            "type" => descending ? query.OrderByDescending(e => e.Type) : query.OrderBy(e => e.Type),
            "serialnumber" => descending ? query.OrderByDescending(e => e.SerialNumber) : query.OrderBy(e => e.SerialNumber),
            "acquisitiondate" => descending ? query.OrderByDescending(e => e.AcquisitionDate) : query.OrderBy(e => e.AcquisitionDate),
            "status" => descending ? query.OrderByDescending(e => e.Status) : query.OrderBy(e => e.Status),
            _ => descending ? query.OrderByDescending(e => e.CreatedAt) : query.OrderBy(e => e.CreatedAt)
        };
    }

    private static IQueryable<Equipment> ApplySortingAndPaging(IQueryable<Equipment> query, EquipmentQueryDto dto)
        => ApplySorting(query, dto)
            .Skip((dto.Page - 1) * dto.PageSize)
            .Take(dto.PageSize);
}
