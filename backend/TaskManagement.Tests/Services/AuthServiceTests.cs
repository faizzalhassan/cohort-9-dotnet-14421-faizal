using BCrypt.Net;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using TaskManagement.Business.DTOs.Auth;
using TaskManagement.Business.Interfaces;
using TaskManagement.Business.Services;
using TaskManagement.Repository.Entities;
using TaskManagement.Repository.Interfaces;
using Xunit;

namespace TaskManagement.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IJwtTokenGenerator> _jwtTokenGeneratorMock;
    private readonly Mock<ILogger<AuthService>> _loggerMock;

    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _jwtTokenGeneratorMock = new Mock<IJwtTokenGenerator>();
        _loggerMock = new Mock<ILogger<AuthService>>();

        _authService = new AuthService(
            _userRepositoryMock.Object,
            _jwtTokenGeneratorMock.Object,
            _loggerMock.Object);
    }
    [Fact]
public async Task RegisterAsync_ShouldRegisterUser_WhenRequestIsValid()
{
    // Arrange

    var request = new RegisterRequest
    {
        FirstName = "Faizal",
        LastName = "Hassan",
        Email = "faizal@test.com",
        Password = "Password123!"
    };

    _userRepositoryMock
        .Setup(x => x.GetByEmailAsync(request.Email))
        .ReturnsAsync((User?)null);

    _jwtTokenGeneratorMock
        .Setup(x => x.GenerateToken(It.IsAny<User>()))
        .Returns("fake-jwt-token");

    // Act

    var result = await _authService.RegisterAsync(request);

    // Assert

    result.Should().NotBeNull();
    result.Email.Should().Be(request.Email);
    result.Token.Should().Be("fake-jwt-token");

    _userRepositoryMock.Verify(
        x => x.AddAsync(It.IsAny<User>()),
        Times.Once);

    _userRepositoryMock.Verify(
        x => x.SaveChangesAsync(),
        Times.Once);

}

    [Fact]
public async Task RegisterAsync_ShouldThrow_WhenEmailAlreadyExists()
{
    // Arrange
    var request = new RegisterRequest
    {
        FirstName = "Faizal",
        LastName = "Hassan",
        Email = "faizal@test.com",
        Password = "Password123!"
    };

    var existingUser = new User
    {
        Id = 1,
        Email = request.Email,
        FirstName = "Existing",
        LastName = "User",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!")
    };

    _userRepositoryMock
        .Setup(x => x.GetByEmailAsync(request.Email))
        .ReturnsAsync(existingUser);

    // Act
    Func<Task> action = async () => await _authService.RegisterAsync(request);

    // Assert
    await action.Should()
        .ThrowAsync<InvalidOperationException>()
        .WithMessage("Email already exists.");

    _userRepositoryMock.Verify(
        x => x.AddAsync(It.IsAny<User>()),
        Times.Never);

    _userRepositoryMock.Verify(
        x => x.SaveChangesAsync(),
        Times.Never);
}
[Fact]
public async Task LoginAsync_ShouldReturnToken_WhenCredentialsAreValid()
{
    // Arrange
    var request = new LoginRequest
    {
        Email = "faizal@test.com",
        Password = "Password123!"
    };

    var user = new User
    {
        Id = 1,
        FirstName = "Faizal",
        LastName = "Hassan",
        Email = request.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
        Role = UserRole.User,
        IsActive = true
    };

    _userRepositoryMock
        .Setup(x => x.GetByEmailAsync(request.Email))
        .ReturnsAsync(user);

    _jwtTokenGeneratorMock
        .Setup(x => x.GenerateToken(user))
        .Returns("fake-jwt-token");

    // Act
    var result = await _authService.LoginAsync(request);

    // Assert
    result.Should().NotBeNull();
    result.Email.Should().Be(user.Email);
    result.Token.Should().Be("fake-jwt-token");
    result.Role.Should().Be(user.Role.ToString());

    _jwtTokenGeneratorMock.Verify(
        x => x.GenerateToken(user),
        Times.Once);
}
[Fact]
public async Task LoginAsync_ShouldThrowUnauthorized_WhenPasswordIsIncorrect()
{
    // Arrange
    var request = new LoginRequest
    {
        Email = "faizal@test.com",
        Password = "WrongPassword"
    };

    var user = new User
    {
        Email = request.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
        IsActive = true
    };

    _userRepositoryMock
        .Setup(x => x.GetByEmailAsync(request.Email))
        .ReturnsAsync(user);

    // Act
    Func<Task> action = async () =>
        await _authService.LoginAsync(request);

    // Assert
    await action.Should()
        .ThrowAsync<UnauthorizedAccessException>()
        .WithMessage("Invalid email or password.");

    _jwtTokenGeneratorMock.Verify(
        x => x.GenerateToken(It.IsAny<User>()),
        Times.Never);
}
[Fact]
public async Task LoginAsync_ShouldThrowUnauthorized_WhenUserDoesNotExist()
{
    // Arrange
    var request = new LoginRequest
    {
        Email = "unknown@test.com",
        Password = "Password123!"
    };

    _userRepositoryMock
        .Setup(x => x.GetByEmailAsync(request.Email))
        .ReturnsAsync((User?)null);

    // Act
    Func<Task> action = async () =>
        await _authService.LoginAsync(request);

    // Assert
    await action.Should()
        .ThrowAsync<UnauthorizedAccessException>()
        .WithMessage("Invalid email or password.");

    _jwtTokenGeneratorMock.Verify(
        x => x.GenerateToken(It.IsAny<User>()),
        Times.Never);
}
[Fact]
public async Task LoginAsync_ShouldThrow_WhenUserIsInactive()
{
    // Arrange
    var request = new LoginRequest
    {
        Email = "faizal@test.com",
        Password = "Password123!"
    };

    var user = new User
    {
        Id = 1,
        FirstName = "Faizal",
        LastName = "Hassan",
        Email = request.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
        IsActive = false,
        Role = UserRole.User
    };

    _userRepositoryMock
        .Setup(x => x.GetByEmailAsync(request.Email))
        .ReturnsAsync(user);

    // Act
    Func<Task> action = async () =>
        await _authService.LoginAsync(request);

    // Assert
    await action.Should()
        .ThrowAsync<UnauthorizedAccessException>()
        .WithMessage("Account is inactive.");

    _jwtTokenGeneratorMock.Verify(
        x => x.GenerateToken(It.IsAny<User>()),
        Times.Never);
}

    }
