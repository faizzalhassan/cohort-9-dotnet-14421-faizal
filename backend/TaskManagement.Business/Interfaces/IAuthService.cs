using TaskManagement.Business.DTOs.Auth;

namespace TaskManagement.Business.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);

    Task<AuthResponse> LoginAsync(LoginRequest request);
}