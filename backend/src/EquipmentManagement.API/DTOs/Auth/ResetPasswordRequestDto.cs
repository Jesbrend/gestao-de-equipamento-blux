namespace EquipmentManagement.API.DTOs.Auth;

public record ResetPasswordRequestDto(string Token, string NewPassword, string ConfirmPassword);
