using Microsoft.AspNetCore.Identity;
using Taskify.Business.DTOs.Profile;
using Taskify.Business.Exceptions;
using Taskify.Business.Interfaces;
using Taskify.Repository.Entities;
using Taskify.Repository.Interfaces;

namespace Taskify.Business.Services;

public class ProfileService : IProfileService
{
    private readonly IUserRepository _userRepository;
    private readonly IUserSessionRepository _sessionRepository;
    private readonly IPasswordHasher<User> _passwordHasher;

    public ProfileService(
        IUserRepository userRepository,
        IUserSessionRepository sessionRepository,
        IPasswordHasher<User> passwordHasher)
    {
        _userRepository = userRepository;
        _sessionRepository = sessionRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<ProfileResponse> GetProfileAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user is null || user.IsDeleted)
        {
            throw new NotFoundException(
                "User profile was not found.");
        }

        return new ProfileResponse
        {
            Id = user.Id,
            FullName = $"{user.FirstName} {user.LastName}".Trim(),
            Email = user.Email,
            Role = user.Role.ToString(),
            AccountCreatedOn = user.CreatedAt,
            IsActive = user.IsActive
        };
    }

    public async Task UpdateFullNameAsync(
        int userId,
        UpdateFullNameRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            throw new ValidationException(
                new Dictionary<string, string[]>
                {
                    ["FullName"] =
                    ["Full name is required."]
                });
        }

        var fullName = request.FullName.Trim();

        var nameParts = fullName
            .Split(
                ' ',
                StringSplitOptions.RemoveEmptyEntries);

        if (nameParts.Length < 2)
        {
            throw new ValidationException(
                new Dictionary<string, string[]>
                {
                    ["FullName"] =
                    ["Please provide both first name and last name."]
                });
        }

        var user = await _userRepository.GetByIdAsync(userId);

        if (user is null || user.IsDeleted)
        {
            throw new NotFoundException(
                "User profile was not found.");
        }

        user.FirstName = nameParts[0];

        user.LastName = string.Join(
            " ",
            nameParts.Skip(1));

        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);
    }

    public async Task ChangePasswordAsync(
        int userId,
        ChangePasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CurrentPassword))
        {
            throw new ValidationException(
                new Dictionary<string, string[]>
                {
                    ["CurrentPassword"] =
                    ["Current password is required."]
                });
        }

        if (string.IsNullOrWhiteSpace(request.NewPassword))
        {
            throw new ValidationException(
                new Dictionary<string, string[]>
                {
                    ["NewPassword"] =
                    ["New password is required."]
                });
        }

        if (request.NewPassword.Length < 8)
        {
            throw new ValidationException(
                new Dictionary<string, string[]>
                {
                    ["NewPassword"] =
                    ["New password must be at least 8 characters long."]
                });
        }

        var user = await _userRepository.GetByIdAsync(userId);

        if (user is null || user.IsDeleted)
        {
            throw new NotFoundException(
                "User profile was not found.");
        }

        var passwordResult =
            _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.CurrentPassword);

        if (passwordResult ==
            PasswordVerificationResult.Failed)
        {
            throw new AuthenticationException(
                "Current password is incorrect.");
        }

        user.PasswordHash =
            _passwordHasher.HashPassword(
                user,
                request.NewPassword);

        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);

        await _sessionRepository.RevokeAllByUserIdAsync(userId);
    }

    public async Task DeactivateAccountAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user is null || user.IsDeleted)
        {
            throw new NotFoundException(
                "User profile was not found.");
        }

        if (!user.IsActive)
        {
            return;
        }

        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);

        await _sessionRepository.RevokeAllByUserIdAsync(userId);
    }

    public async Task DeleteAccountAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user is null || user.IsDeleted)
        {
            throw new NotFoundException(
                "User profile was not found.");
        }

        user.IsActive = false;
        user.IsDeleted = true;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);

        await _sessionRepository.RevokeAllByUserIdAsync(userId);
    }
}