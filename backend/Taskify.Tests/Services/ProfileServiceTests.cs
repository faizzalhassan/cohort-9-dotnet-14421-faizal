using Microsoft.AspNetCore.Identity;
using Moq;
using Taskify.Business.DTOs.Profile;
using Taskify.Business.Exceptions;
using Taskify.Business.Services;
using Taskify.Repository.Entities;
using Taskify.Repository.Interfaces;
using Xunit;

namespace Taskify.Tests.Services;

public class ProfileServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IUserSessionRepository> _sessionRepositoryMock;
    private readonly Mock<IPasswordHasher<User>> _passwordHasherMock;

    private readonly ProfileService _profileService;

    public ProfileServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _sessionRepositoryMock = new Mock<IUserSessionRepository>();
        _passwordHasherMock = new Mock<IPasswordHasher<User>>();

        _profileService = new ProfileService(
            _userRepositoryMock.Object,
            _sessionRepositoryMock.Object,
            _passwordHasherMock.Object);
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private static User CreateUser(
        int id = 1,
        string firstName = "Faizal",
        string lastName = "Hassan",
        string email = "faizal@gmail.com",
        UserRole role = UserRole.User,
        bool isActive = true,
        bool isDeleted = false)
    {
        return new User
        {
            Id = id,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PasswordHash = "hashed-password",
            Role = role,
            IsActive = isActive,
            IsDeleted = isDeleted,
            CreatedAt = DateTime.UtcNow.AddDays(-30),
            UpdatedAt = null,
            LastLoginAt = DateTime.UtcNow.AddDays(-1)
        };
    }

    // ============================================================
    // GET PROFILE
    // ============================================================

    [Fact]
    public async Task GetProfileAsync_ExistingUser_ReturnsProfile()
    {
        // Arrange
        var createdAt = DateTime.UtcNow.AddDays(-30);

        var user = CreateUser(
            id: 1,
            firstName: "Faizal",
            lastName: "Hassan",
            email: "faizal@gmail.com",
            role: UserRole.User);

        user.CreatedAt = createdAt;

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act
        var result = await _profileService.GetProfileAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("Faizal Hassan", result.FullName);
        Assert.Equal("faizal@gmail.com", result.Email);
        Assert.Equal("User", result.Role);
        Assert.Equal(createdAt, result.AccountCreatedOn);
        Assert.True(result.IsActive);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(1),
            Times.Once);
    }

    [Fact]
    public async Task GetProfileAsync_Admin_ReturnsAdminRole()
    {
        // Arrange
        var admin = CreateUser(
            id: 10,
            firstName: "Admin",
            lastName: "User",
            email: "admin@gmail.com",
            role: UserRole.Admin);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(10))
            .ReturnsAsync(admin);

        // Act
        var result = await _profileService.GetProfileAsync(10);

        // Assert
        Assert.Equal(10, result.Id);
        Assert.Equal("Admin User", result.FullName);
        Assert.Equal("Admin", result.Role);
    }

    [Fact]
    public async Task GetProfileAsync_InactiveUser_ReturnsInactiveProfile()
    {
        // Arrange
        var user = CreateUser(
            id: 1,
            isActive: false);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act
        var result = await _profileService.GetProfileAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.IsActive);
    }

    [Fact]
    public async Task GetProfileAsync_UserDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((User?)null);

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<NotFoundException>(
                () => _profileService.GetProfileAsync(999));

        Assert.Equal(
            "User profile was not found.",
            exception.Message);
    }

    [Fact]
    public async Task GetProfileAsync_DeletedUser_ThrowsNotFoundException()
    {
        // Arrange
        var user = CreateUser(
            id: 1,
            isDeleted: true);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<NotFoundException>(
                () => _profileService.GetProfileAsync(1));

        Assert.Equal(
            "User profile was not found.",
            exception.Message);
    }

    // ============================================================
    // UPDATE FULL NAME
    // ============================================================

    [Fact]
    public async Task UpdateFullNameAsync_ValidFullName_UpdatesUser()
    {
        // Arrange
        var user = CreateUser(
            id: 1,
            firstName: "Faizal",
            lastName: "Hassan");

        var request = new UpdateFullNameRequest
        {
            FullName = "Ali Khan"
        };

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act
        await _profileService.UpdateFullNameAsync(
            1,
            request);

        // Assert
        Assert.Equal("Ali", user.FirstName);
        Assert.Equal("Khan", user.LastName);
        Assert.NotNull(user.UpdatedAt);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);
    }

    [Fact]
    public async Task UpdateFullNameAsync_NameWithMultipleLastNames_UpdatesCorrectly()
    {
        // Arrange
        var user = CreateUser();

        var request = new UpdateFullNameRequest
        {
            FullName = "Ali Raza Khan"
        };

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act
        await _profileService.UpdateFullNameAsync(
            1,
            request);

        // Assert
        Assert.Equal("Ali", user.FirstName);
        Assert.Equal("Raza Khan", user.LastName);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);
    }

    [Fact]
    public async Task UpdateFullNameAsync_TrimsWhitespaceBeforeUpdating()
    {
        // Arrange
        var user = CreateUser();

        var request = new UpdateFullNameRequest
        {
            FullName = "   Ali   Khan   "
        };

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act
        await _profileService.UpdateFullNameAsync(
            1,
            request);

        // Assert
        Assert.Equal("Ali", user.FirstName);
        Assert.Equal("Khan", user.LastName);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);
    }

    [Fact]
    public async Task UpdateFullNameAsync_EmptyName_ThrowsValidationException()
    {
        // Arrange
        var request = new UpdateFullNameRequest
        {
            FullName = ""
        };

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.ValidationException>(
                () => _profileService.UpdateFullNameAsync(
                    1,
                    request));

        Assert.Equal(
            "One or more validation errors occurred.",
            exception.Message);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdateFullNameAsync_WhitespaceName_ThrowsValidationException()
    {
        // Arrange
        var request = new UpdateFullNameRequest
        {
            FullName = "   "
        };

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.ValidationException>(
                () => _profileService.UpdateFullNameAsync(
                    1,
                    request));

        Assert.Equal(
            "One or more validation errors occurred.",
            exception.Message);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdateFullNameAsync_OnlyFirstName_ThrowsValidationException()
    {
        // Arrange
        var request = new UpdateFullNameRequest
        {
            FullName = "Faizal"
        };

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.ValidationException>(
                () => _profileService.UpdateFullNameAsync(
                    1,
                    request));

        Assert.Equal(
            "One or more validation errors occurred.",
            exception.Message);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdateFullNameAsync_DeletedUser_ThrowsNotFoundException()
    {
        // Arrange
        var user = CreateUser(
            id: 1,
            isDeleted: true);

        var request = new UpdateFullNameRequest
        {
            FullName = "Ali Khan"
        };

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _profileService.UpdateFullNameAsync(
                1,
                request));

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdateFullNameAsync_UserDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        var request = new UpdateFullNameRequest
        {
            FullName = "Ali Khan"
        };

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((User?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _profileService.UpdateFullNameAsync(
                999,
                request));

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }

    // ============================================================
    // CHANGE PASSWORD
    // ============================================================

    [Fact]
    public async Task ChangePasswordAsync_ValidPassword_ChangesPassword()
    {
        // Arrange
        var user = CreateUser(
            id: 1);

        var request = new ChangePasswordRequest
        {
            CurrentPassword = "OldPassword123",
            NewPassword = "NewPassword123"
        };

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        _passwordHasherMock
            .Setup(x => x.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.CurrentPassword))
            .Returns(
                PasswordVerificationResult.Success);

        _passwordHasherMock
            .Setup(x => x.HashPassword(
                user,
                request.NewPassword))
            .Returns("new-hashed-password");

        // Act
        await _profileService.ChangePasswordAsync(
            1,
            request);

        // Assert
        Assert.Equal(
            "new-hashed-password",
            user.PasswordHash);

        Assert.NotNull(user.UpdatedAt);

        _passwordHasherMock.Verify(
            x => x.VerifyHashedPassword(
                user,
                "hashed-password",
                "OldPassword123"),
            Times.Once);

        _passwordHasherMock.Verify(
            x => x.HashPassword(
                user,
                "NewPassword123"),
            Times.Once);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(1),
            Times.Once);
    }

    [Fact]
    public async Task ChangePasswordAsync_EmptyCurrentPassword_ThrowsValidationException()
    {
        // Arrange
        var request = new ChangePasswordRequest
        {
            CurrentPassword = "",
            NewPassword = "NewPassword123"
        };

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.ValidationException>(
                () => _profileService.ChangePasswordAsync(
                    1,
                    request));

        Assert.Equal(
            "One or more validation errors occurred.",
            exception.Message);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);

        _passwordHasherMock.Verify(
            x => x.VerifyHashedPassword(
                It.IsAny<User>(),
                It.IsAny<string>(),
                It.IsAny<string>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task ChangePasswordAsync_WhitespaceCurrentPassword_ThrowsValidationException()
    {
        // Arrange
        var request = new ChangePasswordRequest
        {
            CurrentPassword = "   ",
            NewPassword = "NewPassword123"
        };

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.ValidationException>(
                () => _profileService.ChangePasswordAsync(
                    1,
                    request));

        Assert.Equal(
            "One or more validation errors occurred.",
            exception.Message);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);

        _passwordHasherMock.Verify(
            x => x.VerifyHashedPassword(
                It.IsAny<User>(),
                It.IsAny<string>(),
                It.IsAny<string>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task ChangePasswordAsync_EmptyNewPassword_ThrowsValidationException()
    {
        // Arrange
        var request = new ChangePasswordRequest
        {
            CurrentPassword = "OldPassword123",
            NewPassword = ""
        };

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.ValidationException>(
                () => _profileService.ChangePasswordAsync(
                    1,
                    request));

        Assert.Equal(
            "One or more validation errors occurred.",
            exception.Message);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);

        _passwordHasherMock.Verify(
            x => x.VerifyHashedPassword(
                It.IsAny<User>(),
                It.IsAny<string>(),
                It.IsAny<string>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task ChangePasswordAsync_NewPasswordLessThanEightCharacters_ThrowsValidationException()
    {
        // Arrange
        var request = new ChangePasswordRequest
        {
            CurrentPassword = "OldPassword123",
            NewPassword = "1234567"
        };

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<
                Taskify.Business.Exceptions.ValidationException>(
                () => _profileService.ChangePasswordAsync(
                    1,
                    request));

        Assert.Equal(
            "One or more validation errors occurred.",
            exception.Message);

        _userRepositoryMock.Verify(
            x => x.GetByIdAsync(It.IsAny<int>()),
            Times.Never);

        _passwordHasherMock.Verify(
            x => x.VerifyHashedPassword(
                It.IsAny<User>(),
                It.IsAny<string>(),
                It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task ChangePasswordAsync_UserDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        var request = new ChangePasswordRequest
        {
            CurrentPassword = "OldPassword123",
            NewPassword = "NewPassword123"
        };

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((User?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _profileService.ChangePasswordAsync(
                999,
                request));

        _passwordHasherMock.Verify(
            x => x.VerifyHashedPassword(
                It.IsAny<User>(),
                It.IsAny<string>(),
                It.IsAny<string>()),
            Times.Never);

        _passwordHasherMock.Verify(
            x => x.HashPassword(
                It.IsAny<User>(),
                It.IsAny<string>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task ChangePasswordAsync_DeletedUser_ThrowsNotFoundException()
    {
        // Arrange
        var user = CreateUser(
            id: 1,
            isDeleted: true);

        var request = new ChangePasswordRequest
        {
            CurrentPassword = "OldPassword123",
            NewPassword = "NewPassword123"
        };

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _profileService.ChangePasswordAsync(
                1,
                request));

        _passwordHasherMock.Verify(
            x => x.VerifyHashedPassword(
                It.IsAny<User>(),
                It.IsAny<string>(),
                It.IsAny<string>()),
            Times.Never);

        _passwordHasherMock.Verify(
            x => x.HashPassword(
                It.IsAny<User>(),
                It.IsAny<string>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task ChangePasswordAsync_IncorrectCurrentPassword_ThrowsAuthenticationException()
    {
        // Arrange
        var user = CreateUser(
            id: 1);

        var request = new ChangePasswordRequest
        {
            CurrentPassword = "WrongPassword",
            NewPassword = "NewPassword123"
        };

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        _passwordHasherMock
            .Setup(x => x.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.CurrentPassword))
            .Returns(
                PasswordVerificationResult.Failed);

        // Act & Assert
        var exception =
            await Assert.ThrowsAsync<AuthenticationException>(
                () => _profileService.ChangePasswordAsync(
                    1,
                    request));

        Assert.Equal(
            "Current password is incorrect.",
            exception.Message);

        _passwordHasherMock.Verify(
            x => x.HashPassword(
                It.IsAny<User>(),
                It.IsAny<string>()),
            Times.Never);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task ChangePasswordAsync_Success_RevokeAllUserSessions()
    {
        // Arrange
        var user = CreateUser(
            id: 5);

        var request = new ChangePasswordRequest
        {
            CurrentPassword = "OldPassword123",
            NewPassword = "NewPassword123"
        };

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(5))
            .ReturnsAsync(user);

        _passwordHasherMock
            .Setup(x => x.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.CurrentPassword))
            .Returns(
                PasswordVerificationResult.Success);

        _passwordHasherMock
            .Setup(x => x.HashPassword(
                user,
                request.NewPassword))
            .Returns("updated-hash");

        // Act
        await _profileService.ChangePasswordAsync(
            5,
            request);

        // Assert
        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(5),
            Times.Once);
    }

    // ============================================================
    // DEACTIVATE ACCOUNT
    // ============================================================

    [Fact]
    public async Task DeactivateAccountAsync_ActiveUser_DeactivatesAccount()
    {
        // Arrange
        var user = CreateUser(
            id: 1,
            isActive: true);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act
        await _profileService.DeactivateAccountAsync(1);

        // Assert
        Assert.False(user.IsActive);
        Assert.False(user.IsDeleted);
        Assert.NotNull(user.UpdatedAt);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(1),
            Times.Once);
    }

    [Fact]
    public async Task DeactivateAccountAsync_AlreadyInactiveUser_DoesNothing()
    {
        // Arrange
        var user = CreateUser(
            id: 1,
            isActive: false);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act
        await _profileService.DeactivateAccountAsync(1);

        // Assert
        Assert.False(user.IsActive);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task DeactivateAccountAsync_UserDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((User?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _profileService.DeactivateAccountAsync(999));

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task DeactivateAccountAsync_DeletedUser_ThrowsNotFoundException()
    {
        // Arrange
        var user = CreateUser(
            id: 1,
            isActive: true,
            isDeleted: true);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _profileService.DeactivateAccountAsync(1));

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    // ============================================================
    // DELETE ACCOUNT
    // ============================================================

    [Fact]
    public async Task DeleteAccountAsync_ActiveUser_SoftDeletesAccount()
    {
        // Arrange
        var user = CreateUser(
            id: 1,
            isActive: true,
            isDeleted: false);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act
        await _profileService.DeleteAccountAsync(1);

        // Assert
        Assert.False(user.IsActive);
        Assert.True(user.IsDeleted);
        Assert.NotNull(user.UpdatedAt);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(1),
            Times.Once);
    }

    [Fact]
    public async Task DeleteAccountAsync_InactiveUser_SoftDeletesAccount()
    {
        // Arrange
        var user = CreateUser(
            id: 1,
            isActive: false,
            isDeleted: false);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act
        await _profileService.DeleteAccountAsync(1);

        // Assert
        Assert.False(user.IsActive);
        Assert.True(user.IsDeleted);
        Assert.NotNull(user.UpdatedAt);

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(user),
            Times.Once);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(1),
            Times.Once);
    }

    [Fact]
    public async Task DeleteAccountAsync_UserDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((User?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _profileService.DeleteAccountAsync(999));

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task DeleteAccountAsync_AlreadyDeletedUser_ThrowsNotFoundException()
    {
        // Arrange
        var user = CreateUser(
            id: 1,
            isActive: false,
            isDeleted: true);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _profileService.DeleteAccountAsync(1));

        _userRepositoryMock.Verify(
            x => x.UpdateAsync(It.IsAny<User>()),
            Times.Never);

        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(It.IsAny<int>()),
            Times.Never);
    }

    [Fact]
    public async Task DeleteAccountAsync_Success_RevokesAllUserSessions()
    {
        // Arrange
        var user = CreateUser(
            id: 7,
            isActive: true,
            isDeleted: false);

        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(7))
            .ReturnsAsync(user);

        // Act
        await _profileService.DeleteAccountAsync(7);

        // Assert
        _sessionRepositoryMock.Verify(
            x => x.RevokeAllByUserIdAsync(7),
            Times.Once);
    }
}