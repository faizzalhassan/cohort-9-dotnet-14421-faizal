using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Taskify.API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (!int.TryParse(userId, out var id))
        {
            throw new UnauthorizedAccessException(
                "Authenticated user ID could not be determined.");
        }

        return id;
    }

    public static string GetUserRole(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.Role)
            ?? throw new UnauthorizedAccessException(
                "Authenticated user role could not be determined.");
    }
}