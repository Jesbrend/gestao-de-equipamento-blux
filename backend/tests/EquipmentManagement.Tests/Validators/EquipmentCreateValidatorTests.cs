using EquipmentManagement.API.DTOs.Equipment;
using EquipmentManagement.API.Validators;
using FluentAssertions;

namespace EquipmentManagement.Tests.Validators;

public class EquipmentCreateValidatorTests
{
    private readonly EquipmentCreateValidator _sut = new();

    private static EquipmentCreateDto ValidDto() => new(
        Name: "Notebook Dell",
        Type: "Computador",
        SerialNumber: "SN-001",
        AcquisitionDate: DateTime.UtcNow.AddDays(-1),
        Status: "Active");

    [Fact]
    public async Task Should_Pass_When_AllFieldsAreValid()
    {
        var result = await _sut.ValidateAsync(ValidDto());
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task Should_Fail_When_NameIsEmpty(string? name)
    {
        var dto = ValidDto() with { Name = name! };
        var result = await _sut.ValidateAsync(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public async Task Should_Fail_When_AcquisitionDateIsFuture()
    {
        var dto = ValidDto() with { AcquisitionDate = DateTime.UtcNow.AddDays(1) };
        var result = await _sut.ValidateAsync(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "AcquisitionDate");
    }

    [Theory]
    [InlineData("InvalidStatus")]
    [InlineData("")]
    public async Task Should_Fail_When_StatusIsInvalid(string status)
    {
        var dto = ValidDto() with { Status = status };
        var result = await _sut.ValidateAsync(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Status");
    }

    [Theory]
    [InlineData("Active")]
    [InlineData("Inactive")]
    [InlineData("UnderMaintenance")]
    [InlineData("Decommissioned")]
    public async Task Should_Pass_For_AllValidStatuses(string status)
    {
        var dto = ValidDto() with { Status = status };
        var result = await _sut.ValidateAsync(dto);
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task Should_Fail_When_SerialNumberIsEmpty()
    {
        var dto = ValidDto() with { SerialNumber = "" };
        var result = await _sut.ValidateAsync(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "SerialNumber");
    }
}
