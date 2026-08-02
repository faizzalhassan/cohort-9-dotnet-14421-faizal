using BCrypt.Net;
using TaskManagement.Business.DTOs.Auth;
using TaskManagement.Business.Interfaces;
using TaskManagement.Repository.Entities;
using TaskManagement.Repository.Interfaces;
using Microsoft.Extensions.Logging;
namespace TaskManagement.Business.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly ILogger<AuthService> _logger;

public AuthService(
    IUserRepository userRepository,
    IJwtTokenGenerator jwtTokenGenerator,
    ILogger<AuthService> logger)
{
    _userRepository = userRepository;
    _jwtTokenGenerator = jwtTokenGenerator;
    _logger = logger;
}
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);

        if (existingUser != null)
        throw new InvalidOperationException("Email already exists.");

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.User,
            IsActive = true
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        var token = _jwtTokenGenerator.GenerateToken(user);
        _logger.LogInformation(
    "New user registered. Email: {Email}",
    user.Email);
        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            FullName = $"{user.FirstName} {user.LastName}",
            Role = user.Role.ToString()
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null)
{
    _logger.LogWarning(
        "Failed login attempt for Email: {Email}",
        request.Email);

    throw new UnauthorizedAccessException("Invalid email or password.");
}

        if (!user.IsActive)
{
    _logger.LogWarning(
        "Inactive account login attempt: {Email}",
        request.Email);

    throw new UnauthorizedAccessException("Account is inactive.");
}

        var validPassword = BCrypt.Net.BCrypt.Verify(
            request.Password,
            user.PasswordHash);

        if (!validPassword)
{
    _logger.LogWarning(
        "Failed login attempt for Email: {Email}",
        request.Email);

    throw new UnauthorizedAccessException("Invalid email or password.");
}

        var token = _jwtTokenGenerator.GenerateToken(user);
        _logger.LogInformation(
    "User logged in successfully. Email: {Email}",
    user.Email);
     return new AuthResponse
{
    Token = token,
    Email = user.Email,
    FullName = $"{user.FirstName} {user.LastName}",
    Role = user.Role.ToString(),
    ExpiresAt = DateTime.UtcNow.AddMinutes(60)
};
    }
}