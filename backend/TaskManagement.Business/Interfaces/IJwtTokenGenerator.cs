using TaskManagement.Repository.Entities;

namespace TaskManagement.Business.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}