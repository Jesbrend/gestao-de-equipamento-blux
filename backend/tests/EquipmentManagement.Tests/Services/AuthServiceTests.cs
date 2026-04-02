using EquipmentManagement.API.Data;
using EquipmentManagement.API.Domain.Entities;
using EquipmentManagement.API.DTOs.Auth;
using EquipmentManagement.API.Services;
using EquipmentManagement.Tests.Helpers;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;

namespace EquipmentManagement.Tests.Services;

public class AuthServiceTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly AuthService _sut;
    private readonly IConfiguration _configuration;

    public AuthServiceTests()
    {
        _context = TestDbContextFactory.Create();

        var configData = new Dictionary<string, string?>
        {
            ["Jwt:Key"] = "TestSuperSecretKey_AtLeast32Chars!!",
            ["Jwt:Issuer"] = "TestIssuer",
            ["Jwt:Audience"] = "TestAudience",
            ["Jwt:ExpiresInHours"] = "1"
        };
        _configuration = new ConfigurationBuilder().AddInMemoryCollection(configData).Build();

        var loggerMock = new Mock<ILogger<AuthService>>();
        _sut = new AuthService(_context, _configuration, loggerMock.Object);
    }

    private async Task<User> CreateTestUser(string email = "test@test.com", string password = "Test@123")
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = "Test User",
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    [Fact]
    public async Task LoginAsync_Should_ReturnToken_When_CredentialsAreValid()
    {
        await CreateTestUser("test@test.com", "Test@123");

        var result = await _sut.LoginAsync(new LoginRequestDto("test@test.com", "Test@123"));

        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrWhiteSpace();
        result.Email.Should().Be("test@test.com");
        result.ExpiresAt.Should().BeAfter(DateTime.UtcNow);
    }

    [Fact]
    public async Task LoginAsync_Should_ThrowUnauthorizedException_When_EmailNotFound()
    {
        var act = () => _sut.LoginAsync(new LoginRequestDto("nonexistent@test.com", "any"));

        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Credenciais inválidas.");
    }

    [Fact]
    public async Task LoginAsync_Should_ThrowUnauthorizedException_When_PasswordIsWrong()
    {
        await CreateTestUser();

        var act = () => _sut.LoginAsync(new LoginRequestDto("test@test.com", "WrongPassword!"));

        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Credenciais inválidas.");
    }

    [Fact]
    public async Task ForgotPasswordAsync_Should_ReturnToken_When_EmailExists()
    {
        await CreateTestUser();

        var result = await _sut.ForgotPasswordAsync(new ForgotPasswordRequestDto("test@test.com"));

        result.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task ForgotPasswordAsync_Should_ReturnMessage_When_EmailDoesNotExist()
    {
        var result = await _sut.ForgotPasswordAsync(new ForgotPasswordRequestDto("ghost@test.com"));

        result.Should().NotBeNull();
    }

    [Fact]
    public async Task ResetPasswordAsync_Should_ThrowInvalidOperation_When_TokenIsInvalid()
    {
        var dto = new ResetPasswordRequestDto("invalid-token", "NewPass@123", "NewPass@123");

        var act = () => _sut.ResetPasswordAsync(dto);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Token inválido ou expirado.");
    }

    [Fact]
    public async Task ResetPasswordAsync_Should_UpdatePassword_When_TokenIsValid()
    {
        await CreateTestUser("reset@test.com", "OldPass@123");
        var token = await _sut.ForgotPasswordAsync(new ForgotPasswordRequestDto("reset@test.com"));

        await _sut.ResetPasswordAsync(new ResetPasswordRequestDto(token, "NewPass@123", "NewPass@123"));

        var loginResult = await _sut.LoginAsync(new LoginRequestDto("reset@test.com", "NewPass@123"));
        loginResult.Should().NotBeNull();
        loginResult.Token.Should().NotBeNullOrWhiteSpace();
    }

    public void Dispose() => _context.Dispose();
}
