using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace Taskify.API.Hubs;

public class TaskifyUserIdProvider : IUserIdProvider
{
    public string? GetUserId(
        HubConnectionContext connection)
    {
        return connection.User?
            .FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? connection.User?
                .FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
