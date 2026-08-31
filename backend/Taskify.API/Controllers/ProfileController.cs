using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taskify.Business.DTOs.Profile;
using Taskify.Business.Interfaces;
using System.Security.Claims;

namespace Taskify.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    // GET: api/profile
    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetCurrentUserId();

        var response = await _profileService.GetProfileAsync(userId);

        return Ok(new
        {
            success = true,
            message = "Profile retrieved successfully.",
            data = response
        });
    }

    // PUT: api/profile/name
    [HttpPut("name")]
    public async Task<IActionResult> UpdateFullName(
        [FromBody] UpdateFullNameRequest request)
    {
        var userId = GetCurrentUserId();

        await _profileService.UpdateFullNameAsync(
            userId,
            request);

        return Ok(new
        {
            success = true,
            message = "Full name updated successfully."
        });
    }

    // PUT: api/profile/password
    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword(
        [FromBody] ChangePasswordRequest request)
    {
        var userId = GetCurrentUserId();

        await _profileService.ChangePasswordAsync(
            userId,
            request);

        return Ok(new
        {
            success = true,
            message = "Password changed successfully."
        });
    }

    // PATCH: api/profile/deactivate
    [HttpPatch("deactivate")]
    public async Task<IActionResult> DeactivateAccount()
    {
        var userId = GetCurrentUserId();

        await _profileService.DeactivateAccountAsync(userId);

        return Ok(new
        {
            success = true,
            message = "Account deactivated successfully."
        });
    }

    // DELETE: api/profile
    [HttpDelete]
    public async Task<IActionResult> DeleteAccount()
    {
        var userId = GetCurrentUserId();

        await _profileService.DeleteAccountAsync(userId);

        return Ok(new
        {
            success = true,
            message = "Account deleted successfully."
        });
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException(
                "Invalid authenticated user.");
        }

        return userId;
    }
}