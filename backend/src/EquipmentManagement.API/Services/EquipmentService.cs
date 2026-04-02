using AutoMapper;
using EquipmentManagement.API.Domain.Entities;
using EquipmentManagement.API.Domain.Enums;
using EquipmentManagement.API.DTOs.Equipment;
using EquipmentManagement.API.Interfaces;

namespace EquipmentManagement.API.Services;

public class EquipmentService(
    IEquipmentRepository repository,
    IMapper mapper,
    ILogger<EquipmentService> logger) : IEquipmentService
{
    public async Task<PagedResultDto<EquipmentResponseDto>> GetPagedAsync(EquipmentQueryDto query, CancellationToken cancellationToken = default)
    {
        var pagedEquipments = await repository.GetPagedAsync(query, cancellationToken);
        var dtos = mapper.Map<IEnumerable<EquipmentResponseDto>>(pagedEquipments.Items);
        return new PagedResultDto<EquipmentResponseDto>(dtos, pagedEquipments.TotalCount, query.Page, query.PageSize);
    }

    public async Task<EquipmentResponseDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var equipment = await repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Equipamento com ID {id} não encontrado.");

        return mapper.Map<EquipmentResponseDto>(equipment);
    }

    public async Task<EquipmentResponseDto> CreateAsync(EquipmentCreateDto dto, CancellationToken cancellationToken = default)
    {
        if (await repository.SerialNumberExistsAsync(dto.SerialNumber, cancellationToken: cancellationToken))
            throw new InvalidOperationException($"Já existe um equipamento com o número de série '{dto.SerialNumber}'.");

        var equipment = mapper.Map<Equipment>(dto);
        var created = await repository.CreateAsync(equipment, cancellationToken);

        logger.LogInformation("Equipment created: {Id} - {Name}", created.Id, created.Name);
        return mapper.Map<EquipmentResponseDto>(created);
    }

    public async Task<EquipmentResponseDto> UpdateAsync(Guid id, EquipmentUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var equipment = await repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Equipamento com ID {id} não encontrado.");

        if (await repository.SerialNumberExistsAsync(dto.SerialNumber, id, cancellationToken))
            throw new InvalidOperationException($"Já existe um equipamento com o número de série '{dto.SerialNumber}'.");

        mapper.Map(dto, equipment);
        var updated = await repository.UpdateAsync(equipment, cancellationToken);

        logger.LogInformation("Equipment updated: {Id} - {Name}", updated.Id, updated.Name);
        return mapper.Map<EquipmentResponseDto>(updated);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var equipment = await repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Equipamento com ID {id} não encontrado.");

        await repository.DeleteAsync(equipment, cancellationToken);
        logger.LogInformation("Equipment deleted: {Id} - {Name}", equipment.Id, equipment.Name);
    }
}
