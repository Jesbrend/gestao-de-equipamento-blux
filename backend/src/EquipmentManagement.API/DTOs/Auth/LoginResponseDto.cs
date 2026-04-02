namespace EquipmentManagement.API.DTOs.Auth;

public record LoginResponseDto(string Token, string Email, string Name, DateTime ExpiresAt);
