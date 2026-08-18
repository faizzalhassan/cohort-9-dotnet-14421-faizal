namespace Taskify.Repository.Entities;

public class UserSession
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public Guid TokenId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime LastActivityAt { get; set; }

    public DateTime? RevokedAt { get; set; }

    public bool IsRevoked { get; set; }

    public User User { get; set; } = null!;
}