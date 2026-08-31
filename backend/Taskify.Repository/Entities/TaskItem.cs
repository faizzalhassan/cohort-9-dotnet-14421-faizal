namespace Taskify.Repository.Entities;

public class TaskItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string Category { get; set; } = string.Empty;

    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    public TaskStatus Status { get; set; } = TaskStatus.Pending;

    public DateTime? DueDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Soft delete flag
    public bool IsDeleted { get; set; } = false;

    public int CreatedByUserId { get; set; }

    public int? AssignedToUserId { get; set; }

    public User CreatedByUser { get; set; } = null!;

    public User? AssignedToUser { get; set; }
}