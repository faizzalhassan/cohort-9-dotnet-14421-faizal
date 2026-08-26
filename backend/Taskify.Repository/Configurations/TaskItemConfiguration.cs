using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Taskify.Repository.Entities;

namespace Taskify.Repository.Configurations;

public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.ToTable("Tasks");

        // ============================================================
        // PRIMARY KEY
        // ============================================================

        builder.HasKey(task => task.Id);

        // ============================================================
        // TASK DETAILS
        // ============================================================

        builder.Property(task => task.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(task => task.Description)
            .HasMaxLength(2000);

        builder.Property(task => task.Category)
            .IsRequired()
            .HasMaxLength(100);

        // ============================================================
        // PRIORITY
        // ============================================================

        builder.Property(task => task.Priority)
            .IsRequired()
            .HasConversion<int>();

        // ============================================================
        // STATUS
        // ============================================================

        builder.Property(task => task.Status)
            .IsRequired()
            .HasConversion<int>();

        // ============================================================
        // DATES
        // ============================================================

        builder.Property(task => task.DueDate);

        builder.Property(task => task.CreatedAt)
            .IsRequired();

        builder.Property(task => task.UpdatedAt);

        // ============================================================
        // SOFT DELETE
        // ============================================================

        builder.Property(task => task.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // ============================================================
        // CREATED BY RELATIONSHIP
        // ============================================================

        builder.HasOne(task => task.CreatedByUser)
            .WithMany(user => user.CreatedTasks)
            .HasForeignKey(task => task.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // ============================================================
        // ASSIGNED TO RELATIONSHIP
        // ============================================================

        builder.HasOne(task => task.AssignedToUser)
            .WithMany(user => user.AssignedTasks)
            .HasForeignKey(task => task.AssignedToUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // ============================================================
        // INDEXES
        // ============================================================

        builder.HasIndex(task => task.CreatedByUserId);

        builder.HasIndex(task => task.AssignedToUserId);

        builder.HasIndex(task => task.Status);

        builder.HasIndex(task => task.DueDate);

        builder.HasIndex(task => task.IsDeleted);
    }
}