using Microsoft.EntityFrameworkCore;
using Taskify.Repository.Context;
using Taskify.Repository.Entities;
using Taskify.Repository.Interfaces;

namespace Taskify.Repository.Repositories;

public class UserRepository : IUserRepository
{
    private readonly TaskifyDbContext _context;

    public UserRepository(TaskifyDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .FirstOrDefaultAsync(user => user.Id == id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(user => user.Email == email);
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await _context.Users
            .AnyAsync(user => user.Email == email);
    }

    public async Task<User> AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<IReadOnlyList<User>> GetAllActiveUsersAsync()
{
    return await _context.Users
        .Where(user => !user.IsDeleted)
        .OrderBy(user => user.FirstName)
        .ThenBy(user => user.LastName)
        .ToListAsync();
}

public async Task<int> GetTaskCountAsync(int userId)
{
    return await _context.Tasks
        .CountAsync(task =>
            !task.IsDeleted &&
            (task.CreatedByUserId == userId ||
             task.AssignedToUserId == userId));
}
}