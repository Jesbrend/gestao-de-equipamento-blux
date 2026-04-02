using EquipmentManagement.API.Domain.Enums;
using EquipmentManagement.API.DTOs.Equipment;
using FluentValidation;

namespace EquipmentManagement.API.Validators;

public class EquipmentUpdateValidator : AbstractValidator<EquipmentUpdateDto>
{
    private static readonly string[] ValidStatuses = Enum.GetNames<EquipmentStatus>();

    public EquipmentUpdateValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Nome é obrigatório.")
            .MaximumLength(200).WithMessage("Nome deve ter no máximo 200 caracteres.");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Tipo é obrigatório.")
            .MaximumLength(100).WithMessage("Tipo deve ter no máximo 100 caracteres.");

        RuleFor(x => x.SerialNumber)
            .NotEmpty().WithMessage("Número de série é obrigatório.")
            .MaximumLength(100).WithMessage("Número de série deve ter no máximo 100 caracteres.");

        RuleFor(x => x.AcquisitionDate)
            .NotEmpty().WithMessage("Data de aquisição é obrigatória.")
            .LessThanOrEqualTo(DateTime.UtcNow.Date).WithMessage("Data de aquisição não pode ser futura.");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status é obrigatório.")
            .Must(s => ValidStatuses.Contains(s, StringComparer.OrdinalIgnoreCase))
            .WithMessage($"Status inválido. Valores aceitos: {string.Join(", ", ValidStatuses)}.");
    }
}
