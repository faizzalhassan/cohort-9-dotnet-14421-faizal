using Taskify.Repository.Entities;

namespace Taskify.Business.Interfaces;

public interface IJwtTokenGenerator
{
    (string Token, DateTime ExpiresAt) GenerateToken(
        User user,
        Guid tokenId);
}