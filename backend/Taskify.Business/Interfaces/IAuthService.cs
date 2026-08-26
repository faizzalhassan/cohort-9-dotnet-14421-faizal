using Taskify.Business.DTOs.Auth;

namespace Taskify.Business.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);

    Task<AuthResponse> LoginAsync(LoginRequest request);

    Task LogoutAsync(Guid tokenId);
}