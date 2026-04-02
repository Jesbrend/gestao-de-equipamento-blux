using EquipmentManagement.API.DTOs.Auth;

namespace EquipmentManagement.API.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, CancellationToken cancellationToken = default);
    Task<string> ForgotPasswordAsync(ForgotPasswordRequestDto dto, CancellationToken cancellationToken = default);
    Task ResetPasswordAsync(ResetPasswordRequestDto dto, CancellationToken cancellationToken = default);
}
