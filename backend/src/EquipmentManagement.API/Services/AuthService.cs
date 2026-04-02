using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EquipmentManagement.API.Data;
using EquipmentManagement.API.DTOs.Auth;
using EquipmentManagement.API.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace EquipmentManagement.API.Services;

public class AuthService(AppDbContext context, IConfiguration configuration, ILogger<AuthService> logger) : IAuthService
{
    private static readonly ConcurrentDictionary<string, (string Email, DateTime Expiry)> _resetTokens = new();

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, CancellationToken cancellationToken = default)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email, cancellationToken)
            ?? throw new UnauthorizedAccessException("Credenciais inválidas.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            logger.LogWarning("Failed login attempt for email {Email}", dto.Email);
            throw new UnauthorizedAccessException("Credenciais inválidas.");
        }

        var (token, expiresAt) = GenerateJwtToken(user.Id, user.Email);

        logger.LogInformation("User {Email} logged in successfully", user.Email);
        return new LoginResponseDto(token, user.Email, user.Name, expiresAt);
    }

    public async Task<string> ForgotPasswordAsync(ForgotPasswordRequestDto dto, CancellationToken cancellationToken = default)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email, cancellationToken);

        // Always return success to prevent email enumeration
        if (user is null)
        {
            logger.LogWarning("Password reset requested for non-existent email {Email}", dto.Email);
            return "Se esse e-mail estiver cadastrado, você receberá as instruções em breve.";
        }

        var token = Guid.NewGuid().ToString("N");
        _resetTokens[token] = (dto.Email, DateTime.UtcNow.AddMinutes(15));

        logger.LogInformation("Password reset token generated for {Email}: {Token}", dto.Email, token);

        // In production, this token would be sent via email.
        // For this demo, we return it directly.
        return token;
    }

    public async Task ResetPasswordAsync(ResetPasswordRequestDto dto, CancellationToken cancellationToken = default)
    {
        if (!_resetTokens.TryGetValue(dto.Token, out var entry))
            throw new InvalidOperationException("Token inválido ou expirado.");

        if (entry.Expiry < DateTime.UtcNow)
        {
            _resetTokens.TryRemove(dto.Token, out _);
            throw new InvalidOperationException("Token expirado.");
        }

        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == entry.Email, cancellationToken)
            ?? throw new InvalidOperationException("Usuário não encontrado.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);
        _resetTokens.TryRemove(dto.Token, out _);

        logger.LogInformation("Password reset successfully for {Email}", entry.Email);
    }

    private (string Token, DateTime ExpiresAt) GenerateJwtToken(Guid userId, string email)
    {
        var jwtConfig = configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["Key"]!));
        var expiresInHours = int.Parse(jwtConfig["ExpiresInHours"] ?? "8");
        var expiresAt = DateTime.UtcNow.AddHours(expiresInHours);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat,
                DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64)
        };

        var token = new JwtSecurityToken(
            issuer: jwtConfig["Issuer"],
            audience: jwtConfig["Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}
