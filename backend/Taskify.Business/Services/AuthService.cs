using FluentValidation;
using Taskify.Business.Exceptions;
using Microsoft.AspNetCore.Identity;
using Taskify.Business.DTOs.Auth;
using Taskify.Business.Interfaces;
using Taskify.Repository.Entities;
using Taskify.Repository.Interfaces;

namespace Taskify.Business.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IUserSessionRepository _sessionRepository;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IValidator<RegisterRequest> _registerValidator;
    private readonly IValidator<LoginRequest> _loginValidator;

public AuthService(
    IUserRepository userRepository,
    IUserSessionRepository sessionRepository,
    IPasswordHasher<User> passwordHasher,
    IJwtTokenGenerator jwtTokenGenerator,
    IValidator<RegisterRequest> registerValidator,
    IValidator<LoginRequest> loginValidator)
{
    _userRepository = userRepository;
    _sessionRepository = sessionRepository;
    _passwordHasher = passwordHasher;
    _jwtTokenGenerator = jwtTokenGenerator;
    _registerValidator = registerValidator;
    _loginValidator = loginValidator;
}
    public async Task<AuthResponse> RegisterAsync(
        RegisterRequest request)
    {
        var validationResult =
    await _registerValidator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
              throw new Taskify.Business.Exceptions.ValidationException(
                    validationResult.ToDictionary());
        
        }

        var email = request.Email.Trim().ToLowerInvariant();

        var existingUser =
            await _userRepository.GetByEmailAsync(email);

        if (existingUser is not null)
        {
            throw new ConflictException(
                "An account with this email already exists.");
        }

        var user = new User
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = email,
            Role = UserRole.User,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash =
            _passwordHasher.HashPassword(user, request.Password);

        var createdUser =
            await _userRepository.AddAsync(user);

        var tokenId = Guid.NewGuid();

        var session = new UserSession
        {
            UserId = createdUser.Id,
            TokenId = tokenId,
            CreatedAt = DateTime.UtcNow,
            LastActivityAt = DateTime.UtcNow,
            IsRevoked = false
        };

        var (token, expiresAt) =
            _jwtTokenGenerator.GenerateToken(
                createdUser,
                tokenId);

        session.ExpiresAt = expiresAt;

        await _sessionRepository.AddAsync(session);

        return CreateAuthResponse(
            createdUser,
            token,
            expiresAt);
    }

    public async Task<AuthResponse> LoginAsync(
        LoginRequest request)
    {

        var validationResult =
    await _loginValidator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
              throw new Taskify.Business.Exceptions.ValidationException(
                    validationResult.ToDictionary());
        
        }

        var email = request.Email.Trim().ToLowerInvariant();

        var user =
            await _userRepository.GetByEmailAsync(email);

        if (user is null)
        {
            throw new AuthenticationException(
                "Invalid email or password.");
        }

        if (!user.IsActive)
        {
            throw new AuthenticationException(
                "This account is currently inactive.");
        }

        var passwordResult =
            _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password);

        if (passwordResult == PasswordVerificationResult.Failed)
        {
               throw new AuthenticationException(
                "Invalid email or password.");
        }

        user.LastLoginAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);

        var tokenId = Guid.NewGuid();

        var (token, expiresAt) =
            _jwtTokenGenerator.GenerateToken(
                user,
                tokenId);

        var session = new UserSession
        {
            UserId = user.Id,
            TokenId = tokenId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt,
            LastActivityAt = DateTime.UtcNow,
            IsRevoked = false
        };

        await _sessionRepository.AddAsync(session);

        return CreateAuthResponse(
            user,
            token,
            expiresAt);
    }

    public async Task LogoutAsync(Guid tokenId)
    {
        var session =
            await _sessionRepository.GetByTokenIdAsync(tokenId);

        if (session is null || session.IsRevoked)
        {
            return;
        }

        await _sessionRepository.RevokeAsync(session);
    }

    private static AuthResponse CreateAuthResponse(
        User user,
        string token,
        DateTime expiresAt)
    {
        return new AuthResponse
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = new UserResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role.ToString()
            }
        };
    }
}