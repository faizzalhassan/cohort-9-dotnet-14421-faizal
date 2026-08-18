using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taskify.Business.DTOs.Auth;
using System.Security.Claims;
using Taskify.Business.Interfaces;

namespace Taskify.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest request)
    {
        var response = await _authService.RegisterAsync(request);

        return StatusCode(
            StatusCodes.Status201Created,
            new
            {
                success = true,
                message = "Registration successful.",
                data = response
            });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);

        return Ok(new
        {
            success = true,
            message = "Login successful.",
            data = response
        });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var tokenIdClaim = User.FindFirst(
            JwtRegisteredClaimNames.Jti)?.Value;

        if (!Guid.TryParse(tokenIdClaim, out var tokenId))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid authentication session."
            });
        }

        await _authService.LogoutAsync(tokenId);

        return Ok(new
        {
            success = true,
            message = "Logout successful."
        });
    }
    [HttpGet("me")]
[Authorize]
public async Task<IActionResult> Me()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var email = User.FindFirst(ClaimTypes.Email)?.Value;
    var role = User.FindFirst(ClaimTypes.Role)?.Value;

    return Ok(new
    {
        success = true,
        data = new
        {
            userId,
            email,
            role
        }
    });
}

[HttpGet("admin-test")]
[Authorize(Roles = "Admin")]
public IActionResult AdminTest()
{
    return Ok(new
    {
        success = true,
        message = "Admin authorization successful."
    });
}
}