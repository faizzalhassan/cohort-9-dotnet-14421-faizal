namespace Taskify.Business.DTOs.Tasks;

public class UpdateTaskRequest
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string Category { get; set; } = string.Empty;

    public int Priority { get; set; }

    public DateTime? DueDate { get; set; }

    public int? AssignedToUserId { get; set; }
}