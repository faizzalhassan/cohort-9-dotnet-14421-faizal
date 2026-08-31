using Taskify.Business.DTOs.Users;
using Taskify.Business.Exceptions;
using Taskify.Business.Interfaces;
using Taskify.Repository.Interfaces;

namespace Taskify.Business.Services;

public class UserManagementService : IUserManagementService
{
    private readonly IUserRepository _userRepository;

    public UserManagementService(
        IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IReadOnlyList<AdminUserResponse>>
        GetAllUsersAsync(int currentAdminId)
    {
        var users = await _userRepository.GetAllActiveUsersAsync();

        var response = new List<AdminUserResponse>();

        foreach (var user in users)
        {
            var taskCount =
                await _userRepository.GetTaskCountAsync(user.Id);

            response.Add(new AdminUserResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                TaskCount = taskCount,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt
            });
        }

        return response;
    }

    public async Task ActivateUserAsync(
        int userId,
        int currentAdminId)
    {
        var user = await GetUserForManagementAsync(userId);

        if (user.Id == currentAdminId)
        {
            throw new ConflictException(
                "You cannot change the status of your own account.");
        }

        user.IsActive = true;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);
    }

    public async Task DeactivateUserAsync(
        int userId,
        int currentAdminId)
    {
        var user = await GetUserForManagementAsync(userId);

        if (user.Id == currentAdminId)
        {
            throw new ConflictException(
                "You cannot deactivate your own account.");
        }

        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);
    }

    public async Task DeleteUserAsync(
        int userId,
        int currentAdminId)
    {
        var user = await GetUserForManagementAsync(userId);

        if (user.Id == currentAdminId)
        {
            throw new ConflictException(
                "You cannot delete your own account.");
        }

        user.IsDeleted = true;
        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);
    }

    private async Task<Taskify.Repository.Entities.User>
        GetUserForManagementAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user is null || user.IsDeleted)
        {
            throw new NotFoundException(
                "User not found.");
        }

        return user;
    }
}