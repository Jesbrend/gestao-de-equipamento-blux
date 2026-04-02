using EquipmentManagement.API.DTOs.Auth;
using FluentValidation;

namespace EquipmentManagement.API.Validators;

public class ForgotPasswordValidator : AbstractValidator<ForgotPasswordRequestDto>
{
    public ForgotPasswordValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("E-mail é obrigatório.")
            .EmailAddress().WithMessage("Formato de e-mail inválido.");
    }
}
