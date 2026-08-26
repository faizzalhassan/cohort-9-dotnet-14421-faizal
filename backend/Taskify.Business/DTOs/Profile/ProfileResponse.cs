namespace Taskify.Business.DTOs.Profile;

public class ProfileResponse
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public DateTime AccountCreatedOn { get; set; }

    public bool IsActive { get; set; }
}