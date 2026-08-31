using Taskify.Business.DTOs.Profile;

namespace Taskify.Business.Interfaces;

public interface IProfileService
{
    Task<ProfileResponse> GetProfileAsync(int userId);

    Task UpdateFullNameAsync(
        int userId,
        UpdateFullNameRequest request);

    Task ChangePasswordAsync(
        int userId,
        ChangePasswordRequest request);

    Task DeactivateAccountAsync(int userId);

    Task DeleteAccountAsync(int userId);
}