using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManagement.Business.DTOs.Auth;
using TaskManagement.Business.Interfaces;

namespace TaskManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new
        {
            Message = "You are authenticated.",
            Name = User.Identity?.Name,
            Email = User.FindFirst(ClaimTypes.Email)?.Value,
            Role = User.FindFirst(ClaimTypes.Role)?.Value
        });
    }
    [Authorize]
[HttpPost("logout")]
public IActionResult Logout()
{
    return Ok(new
    {
        Message = "Logged out successfully."
    });
}
}