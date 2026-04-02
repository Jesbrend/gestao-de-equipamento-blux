using AutoMapper;
using EquipmentManagement.API.Domain.Entities;
using EquipmentManagement.API.Domain.Enums;
using EquipmentManagement.API.DTOs.Equipment;
using EquipmentManagement.API.Interfaces;
using EquipmentManagement.API.Mappings;
using EquipmentManagement.API.Services;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace EquipmentManagement.Tests.Services;

public class EquipmentServiceTests
{
    private readonly Mock<IEquipmentRepository> _repositoryMock = new();
    private readonly IMapper _mapper;
    private readonly Mock<ILogger<EquipmentService>> _loggerMock = new();
    private readonly EquipmentService _sut;

    public EquipmentServiceTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<EquipmentProfile>());
        _mapper = config.CreateMapper();
        _sut = new EquipmentService(_repositoryMock.Object, _mapper, _loggerMock.Object);
    }

    private static Equipment CreateEquipment(string? serialNumber = null) => new()
    {
        Id = Guid.NewGuid(),
        Name = "Notebook Dell",
        Type = "Computador",
        SerialNumber = serialNumber ?? "SN-001",
        AcquisitionDate = DateTime.UtcNow.AddDays(-10),
        Status = EquipmentStatus.Active,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    [Fact]
    public async Task GetByIdAsync_Should_ReturnDto_When_EquipmentExists()
    {
        var equipment = CreateEquipment();
        _repositoryMock.Setup(r => r.GetByIdAsync(equipment.Id, default)).ReturnsAsync(equipment);

        var result = await _sut.GetByIdAsync(equipment.Id);

        result.Should().NotBeNull();
        result.Id.Should().Be(equipment.Id);
        result.Name.Should().Be(equipment.Name);
        result.Status.Should().Be("Active");
    }

    [Fact]
    public async Task GetByIdAsync_Should_ThrowKeyNotFoundException_When_NotFound()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync((Equipment?)null);

        var act = () => _sut.GetByIdAsync(Guid.NewGuid());

        await act.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task CreateAsync_Should_ReturnDto_When_SerialNumberIsUnique()
    {
        var dto = new EquipmentCreateDto("Notebook", "Computador", "SN-999", DateTime.UtcNow.AddDays(-1), "Active");
        _repositoryMock.Setup(r => r.SerialNumberExistsAsync(dto.SerialNumber, null, default)).ReturnsAsync(false);
        _repositoryMock.Setup(r => r.CreateAsync(It.IsAny<Equipment>(), default))
            .ReturnsAsync((Equipment e, CancellationToken _) => e);

        var result = await _sut.CreateAsync(dto);

        result.Should().NotBeNull();
        result.Name.Should().Be("Notebook");
        result.SerialNumber.Should().Be("SN-999");
    }

    [Fact]
    public async Task CreateAsync_Should_ThrowInvalidOperationException_When_SerialNumberExists()
    {
        var dto = new EquipmentCreateDto("Notebook", "Computador", "SN-DUPLICATE", DateTime.UtcNow.AddDays(-1), "Active");
        _repositoryMock.Setup(r => r.SerialNumberExistsAsync(dto.SerialNumber, null, default)).ReturnsAsync(true);

        var act = () => _sut.CreateAsync(dto);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*SN-DUPLICATE*");
    }

    [Fact]
    public async Task DeleteAsync_Should_ThrowKeyNotFoundException_When_NotFound()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync((Equipment?)null);

        var act = () => _sut.DeleteAsync(Guid.NewGuid());

        await act.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task DeleteAsync_Should_CallRepository_When_EquipmentExists()
    {
        var equipment = CreateEquipment();
        _repositoryMock.Setup(r => r.GetByIdAsync(equipment.Id, default)).ReturnsAsync(equipment);
        _repositoryMock.Setup(r => r.DeleteAsync(equipment, default)).Returns(Task.CompletedTask);

        await _sut.DeleteAsync(equipment.Id);

        _repositoryMock.Verify(r => r.DeleteAsync(equipment, default), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_Should_ThrowKeyNotFoundException_When_NotFound()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync((Equipment?)null);

        var act = () => _sut.UpdateAsync(Guid.NewGuid(),
            new EquipmentUpdateDto("Name", "Type", "SN", DateTime.UtcNow.AddDays(-1), "Active"));

        await act.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task GetPagedAsync_Should_ReturnPagedResult()
    {
        var equipments = new List<Equipment> { CreateEquipment() };
        var query = new EquipmentQueryDto();
        var pagedResult = new PagedResultDto<Equipment>(equipments, 1, 1, 10);

        _repositoryMock.Setup(r => r.GetPagedAsync(query, default)).ReturnsAsync(pagedResult);

        var result = await _sut.GetPagedAsync(query);

        result.Should().NotBeNull();
        result.TotalCount.Should().Be(1);
        result.Items.Should().HaveCount(1);
    }
}
