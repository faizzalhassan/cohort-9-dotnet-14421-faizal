using Microsoft.EntityFrameworkCore;
using Taskify.Repository.Context;
using Taskify.Repository.Entities;
using Taskify.Repository.Interfaces;

namespace Taskify.Repository.Repositories;

public class UserSessionRepository : IUserSessionRepository
{
    private readonly TaskifyDbContext _context;

    public UserSessionRepository(TaskifyDbContext context)
    {
        _context = context;
    }

    public async Task<UserSession?> GetByTokenIdAsync(Guid tokenId)
    {
        return await _context.UserSessions
            .FirstOrDefaultAsync(session => session.TokenId == tokenId);
    }

    public async Task<UserSession> AddAsync(UserSession session)
    {
        await _context.UserSessions.AddAsync(session);
        await _context.SaveChangesAsync();

        return session;
    }

    public async Task RevokeAsync(UserSession session)
    {
        session.IsRevoked = true;
        session.RevokedAt = DateTime.UtcNow;

        _context.UserSessions.Update(session);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(UserSession session)
    {
        _context.UserSessions.Update(session);
        await _context.SaveChangesAsync();
    }

    public async Task RevokeAllByUserIdAsync(int userId)
{
    var sessions = await _context.UserSessions
        .Where(session =>
            session.UserId == userId &&
            !session.IsRevoked)
        .ToListAsync();

    if (sessions.Count == 0)
    {
        return;
    }

    var revokedAt = DateTime.UtcNow;

    foreach (var session in sessions)
    {
        session.IsRevoked = true;
        session.RevokedAt = revokedAt;
    }

    await _context.SaveChangesAsync();
}
}