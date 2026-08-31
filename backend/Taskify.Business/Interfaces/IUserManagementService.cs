using Taskify.Business.DTOs.Users;

namespace Taskify.Business.Interfaces;

public interface IUserManagementService
{
    Task<IReadOnlyList<AdminUserResponse>> GetAllUsersAsync(
        int currentAdminId);

    Task ActivateUserAsync(
        int userId,
        int currentAdminId);

    Task DeactivateUserAsync(
        int userId,
        int currentAdminId);

    Task DeleteUserAsync(
        int userId,
        int currentAdminId);
}