using Taskify.Repository.Entities;

namespace Taskify.Repository.Interfaces;

public interface IUserSessionRepository
{
    Task<UserSession?> GetByTokenIdAsync(Guid tokenId);

    Task<UserSession> AddAsync(UserSession session);

    Task RevokeAsync(UserSession session);

    Task RevokeAllByUserIdAsync(int userId);

    Task UpdateAsync(UserSession session);
}