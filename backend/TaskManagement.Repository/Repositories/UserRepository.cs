using Microsoft.EntityFrameworkCore;
using TaskManagement.Repository.Context;
using TaskManagement.Repository.Entities;
using TaskManagement.Repository.Interfaces;

namespace TaskManagement.Repository.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
    public async Task<bool> EmailExistsAsync(string email)
{
    return await _context.Users.AnyAsync(x => x.Email == email);
}
}