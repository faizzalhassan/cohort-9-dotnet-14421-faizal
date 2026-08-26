using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Moq;
using Taskify.Business.DTOs.Auth;
using Taskify.Business.Exceptions;
using Taskify.Business.Interfaces;
using Taskify.Business.Services;
using Taskify.Repository.Entities;
using Taskify.Repository.Interfaces;
using Xunit;

namespace Taskify.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IUserSessionRepository> _sessionRepositoryMock;
    private readonly Mock<IPasswordHasher<User>> _passwordHasherMock;
    private readonly Mock<IJwtTokenGenerator> _jwtTokenGeneratorMock;
    private readonly Mock<IValidator<RegisterRequest>> _registerValidatorMock;
    private readonly Mock<IValidator<LoginRequest>> _loginValidatorMock;
    private readonly AuthService _authService;
public AuthServiceTests()
{
    _userRepositoryMock = new Mock<IUserRepository>();
    _sessionRepositoryMock = new Mock<IUserSessionRepository>();
    _passwordHasherMock = new Mock<IPasswordHasher<User>>();
    _jwtTokenGeneratorMock = new Mock<IJwtTokenGenerator>();
    _registerValidatorMock = new Mock<IValidator<RegisterRequest>>();
    _loginValidatorMock = new Mock<IValidator<LoginRequest>>();

    _authService = new AuthService(
        _userRepositoryMock.Object,
        _sessionRepositoryMock.Object,
        _passwordHasherMock.Object,
        _jwtTokenGeneratorMock.Object,
        _registerValidatorMock.Object,
        _loginValidatorMock.Object);
}

    [Fact]
    public async Task RegisterAsync_ValidRequest_CreatesUserAndSession()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FirstName = "Faizal",
            LastName = "Hassan",
            Email = "faizal@gmail.com",
            Password = "Faizal123@",
            ConfirmPassword = "Faizal123@"
        };

        var validationResult =
            new FluentValidation.Results.ValidationResult();

        _registerValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync("faizal@gmail.com"))
            .ReturnsAsync((User?)null);

        _passwordHasherMock
            .Setup(x => x.HashPassword(
                It.IsAny<User>(),
                request.Password))
            .Returns("hashed-password");

        var createdUser = new User
        {
            Id = 1,
            FirstName = "Faizal",
            LastName = "Hassan",
            Email = "faizal@gmail.com",
            PasswordHash = "hashed-password",
            Role = UserRole.User,
            IsActive = true
        };

        _userRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<User>()))
            .ReturnsAsync(createdUser);

        var expiresAt = DateTime.UtcNow.AddHours(1);

        (string Token, DateTime ExpiresAt) tokenResult =
            ("test-token", expiresAt);

        _jwtTokenGeneratorMock
            .Setup(x => x.GenerateToken(
                It.IsAny<User>(),
                It.IsAny<Guid>()))
            .Returns(tokenResult);

        _sessionRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<UserSession>()))
            .ReturnsAsync((UserSession session) => session);

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("test-token", result.Token);
        Assert.Equal(expiresAt, result.ExpiresAt);
        Assert.Equal("faizal@gmail.com", result.User.Email);
        Assert.Equal("Faizal", result.User.FirstName);
        Assert.Equal("Hassan", result.User.LastName);
        Assert.Equal("User", result.User.Role);

        _userRepositoryMock.Verify(
            x => x.AddAsync(It.Is<User>(u =>
                u.Email == "faizal@gmail.com" &&
                u.Role == UserRole.User &&
                u.IsActive)),
            Times.Once);

        _sessionRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<UserSession>()),
            Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_DuplicateEmail_ThrowsConflictException()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FirstName = "Faizal",
            LastName = "Hassan",
            Email = "faizal@gmail.com",
            Password = "Faizal123@",
            ConfirmPassword = "Faizal123@"
        };

        var validationResult =
            new FluentValidation.Results.ValidationResult();

        _registerValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync("faizal@gmail.com"))
            .ReturnsAsync(new User());

        // Act & Assert
        await Assert.ThrowsAsync<ConflictException>(
            () => _authService.RegisterAsync(request));

        _userRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<User>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<UserSession>()),
            Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_InvalidRequest_ThrowsValidationException()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FirstName = "",
            LastName = "",
            Email = "invalid-email",
            Password = "123",
            ConfirmPassword = "123"
        };

        var failures =
            new List<FluentValidation.Results.ValidationFailure>
            {
                new("Email", "Invalid email."),
                new("Password", "Password is invalid.")
            };

        var validationResult =
            new FluentValidation.Results.ValidationResult(failures);

        _registerValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        // Act & Assert
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.ValidationException>(
            () => _authService.RegisterAsync(request));

        _userRepositoryMock.Verify(
            x => x.GetByEmailAsync(It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsAuthResponse()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "faizal@gmail.com",
            Password = "Faizal123@"
        };

        var validationResult =
            new FluentValidation.Results.ValidationResult();

        _loginValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        var user = new User
        {
            Id = 1,
            FirstName = "Faizal",
            LastName = "Hassan",
            Email = "faizal@gmail.com",
            PasswordHash = "hashed-password",
            Role = UserRole.User,
            IsActive = true
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync("faizal@gmail.com"))
            .ReturnsAsync(user);

        _passwordHasherMock
            .Setup(x => x.VerifyHashedPassword(
                user,
                "hashed-password",
                request.Password))
            .Returns(PasswordVerificationResult.Success);

        var expiresAt = DateTime.UtcNow.AddHours(1);

        (string Token, DateTime ExpiresAt) tokenResult =
            ("login-token", expiresAt);

        _jwtTokenGeneratorMock
            .Setup(x => x.GenerateToken(
                user,
                It.IsAny<Guid>()))
            .Returns(tokenResult);

        _sessionRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<UserSession>()))
            .ReturnsAsync((UserSession session) => session);

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("login-token", result.Token);
        Assert.Equal(expiresAt, result.ExpiresAt);
        Assert.Equal("faizal@gmail.com", result.User.Email);
        Assert.Equal("Faizal", result.User.FirstName);
        Assert.Equal("Hassan", result.User.LastName);
        Assert.Equal("User", result.User.Role);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);

        _sessionRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<UserSession>()),
            Times.Once);
    }

    [Fact]
    public async Task LoginAsync_InvalidEmail_ThrowsAuthenticationException()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "unknown@gmail.com",
            Password = "Faizal123@"
        };

        var validationResult =
            new FluentValidation.Results.ValidationResult();

        _loginValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync("unknown@gmail.com"))
            .ReturnsAsync((User?)null);

        // Act & Assert
        await Assert.ThrowsAsync<AuthenticationException>(
            () => _authService.LoginAsync(request));

        _jwtTokenGeneratorMock.Verify(
            x => x.GenerateToken(
                It.IsAny<User>(),
                It.IsAny<Guid>()),
            Times.Never);
    }

    [Fact]
    public async Task LoginAsync_InvalidPassword_ThrowsAuthenticationException()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "faizal@gmail.com",
            Password = "WrongPassword123"
        };

        var validationResult =
            new FluentValidation.Results.ValidationResult();

        _loginValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        var user = new User
        {
            Id = 1,
            Email = "faizal@gmail.com",
            PasswordHash = "hashed-password",
            Role = UserRole.User,
            IsActive = true
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync("faizal@gmail.com"))
            .ReturnsAsync(user);

        _passwordHasherMock
            .Setup(x => x.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password))
            .Returns(PasswordVerificationResult.Failed);

        // Act & Assert
        await Assert.ThrowsAsync<AuthenticationException>(
            () => _authService.LoginAsync(request));

        _sessionRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<UserSession>()),
            Times.Never);
    }

    [Fact]
    public async Task LoginAsync_InactiveUser_ThrowsAuthenticationException()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "inactive@gmail.com",
            Password = "Faizal123@"
        };

        var validationResult =
            new FluentValidation.Results.ValidationResult();

        _loginValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        var user = new User
        {
            Id = 2,
            Email = "inactive@gmail.com",
            PasswordHash = "hashed-password",
            Role = UserRole.User,
            IsActive = false
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync("inactive@gmail.com"))
            .ReturnsAsync(user);

        // Act & Assert
        await Assert.ThrowsAsync<AuthenticationException>(
            () => _authService.LoginAsync(request));

        _passwordHasherMock.Verify(
            x => x.VerifyHashedPassword(
                It.IsAny<User>(),
                It.IsAny<string>(),
                It.IsAny<string>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.AddAsync(It.IsAny<UserSession>()),
            Times.Never);
    }

    [Fact]
    public async Task LoginAsync_InvalidRequest_ThrowsValidationException()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "",
            Password = ""
        };

        var failures =
            new List<FluentValidation.Results.ValidationFailure>
            {
                new("Email", "Email is required."),
                new("Password", "Password is required.")
            };

        var validationResult =
            new FluentValidation.Results.ValidationResult(failures);

        _loginValidatorMock
            .Setup(x => x.ValidateAsync(
                request,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        // Act & Assert
        await Assert.ThrowsAsync<
            Taskify.Business.Exceptions.ValidationException>(
            () => _authService.LoginAsync(request));

        _userRepositoryMock.Verify(
            x => x.GetByEmailAsync(It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task LogoutAsync_ValidSession_RevokesSession()
    {
        // Arrange
        var tokenId = Guid.NewGuid();

        var session = new UserSession
        {
            TokenId = tokenId,
            IsRevoked = false
        };

        _sessionRepositoryMock
            .Setup(x => x.GetByTokenIdAsync(tokenId))
            .ReturnsAsync(session);

        // Act
        await _authService.LogoutAsync(tokenId);

        // Assert
        _sessionRepositoryMock.Verify(
            x => x.RevokeAsync(session),
            Times.Once);
    }

    [Fact]
    public async Task LogoutAsync_NonExistingSession_DoesNothing()
    {
        // Arrange
        var tokenId = Guid.NewGuid();

        _sessionRepositoryMock
            .Setup(x => x.GetByTokenIdAsync(tokenId))
            .ReturnsAsync((UserSession?)null);

        // Act
        await _authService.LogoutAsync(tokenId);

        // Assert
        _sessionRepositoryMock.Verify(
            x => x.RevokeAsync(It.IsAny<UserSession>()),
            Times.Never);
    }

    [Fact]
    public async Task LogoutAsync_AlreadyRevokedSession_DoesNothing()
    {
        // Arrange
        var tokenId = Guid.NewGuid();

        var session = new UserSession
        {
            TokenId = tokenId,
            IsRevoked = true
        };

        _sessionRepositoryMock
            .Setup(x => x.GetByTokenIdAsync(tokenId))
            .ReturnsAsync(session);

        // Act
        await _authService.LogoutAsync(tokenId);

        // Assert
        _sessionRepositoryMock.Verify(
            x => x.RevokeAsync(It.IsAny<UserSession>()),
            Times.Never);
    }
}