using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Taskify.Repository.Interfaces;

namespace Taskify.API.Middleware;

public class SessionValidationMiddleware
{
    private readonly RequestDelegate _next;

    public SessionValidationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext context,
        IUserSessionRepository sessionRepository)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var tokenIdValue = context.User.FindFirst(
                JwtRegisteredClaimNames.Jti)?.Value;

            if (!Guid.TryParse(tokenIdValue, out var tokenId))
            {
                context.Response.StatusCode =
                    StatusCodes.Status401Unauthorized;

                await context.Response.WriteAsJsonAsync(new
                {
                    success = false,
                    message = "Invalid authentication session."
                });

                return;
            }

            var session =
                await sessionRepository.GetByTokenIdAsync(tokenId);

            if (session is null || session.IsRevoked)
            {
                context.Response.StatusCode =
                    StatusCodes.Status401Unauthorized;

                await context.Response.WriteAsJsonAsync(new
                {
                    success = false,
                    message = "Your session is no longer valid."
                });

                return;
            }

            if (session.ExpiresAt <= DateTime.UtcNow)
            {
                await sessionRepository.RevokeAsync(session);

                context.Response.StatusCode =
                    StatusCodes.Status401Unauthorized;

                await context.Response.WriteAsJsonAsync(new
                {
                    success = false,
                    message = "Your session has expired."
                });

                return;
            }

            session.LastActivityAt = DateTime.UtcNow;

            await sessionRepository.UpdateAsync(session);
        }

        await _next(context);
    }
}