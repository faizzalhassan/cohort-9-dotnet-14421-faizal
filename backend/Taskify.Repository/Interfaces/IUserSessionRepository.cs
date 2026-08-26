using Taskify.Repository.Entities;

namespace Taskify.Repository.Interfaces;

public interface IUserSessionRepository
{
    Task<UserSession?> GetByTokenIdAsync(Guid tokenId);

    Task<UserSession> AddAsync(UserSession session);

    Task RevokeAsync(UserSession session);

    Task UpdateAsync(UserSession session);
}