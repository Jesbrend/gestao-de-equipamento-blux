using EquipmentManagement.API.DTOs.Auth;
using EquipmentManagement.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EquipmentManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController(IAuthService authService, ILogger<AuthController> logger) : ControllerBase
{
    /// <summary>Realiza o login do usuário.</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto, CancellationToken cancellationToken)
    {
        var result = await authService.LoginAsync(dto, cancellationToken);
        return Ok(result);
    }

    /// <summary>Solicita a recuperação de senha.</summary>
    [HttpPost("forgot-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto dto, CancellationToken cancellationToken)
    {
        var token = await authService.ForgotPasswordAsync(dto, cancellationToken);
        // In production, the token would be sent via email, not returned here.
        return Ok(new { message = "Instruções enviadas para o e-mail informado.", token });
    }

    /// <summary>Redefine a senha com o token de recuperação.</summary>
    [HttpPost("reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto dto, CancellationToken cancellationToken)
    {
        await authService.ResetPasswordAsync(dto, cancellationToken);
        return Ok(new { message = "Senha redefinida com sucesso." });
    }
}
