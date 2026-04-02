using EquipmentManagement.API.DTOs.Auth;
using FluentValidation;

namespace EquipmentManagement.API.Validators;

public class ResetPasswordValidator : AbstractValidator<ResetPasswordRequestDto>
{
    public ResetPasswordValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Token é obrigatório.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("Nova senha é obrigatória.")
            .MinimumLength(6).WithMessage("Senha deve ter pelo menos 6 caracteres.");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Confirmação de senha é obrigatória.")
            .Equal(x => x.NewPassword).WithMessage("As senhas não correspondem.");
    }
}
