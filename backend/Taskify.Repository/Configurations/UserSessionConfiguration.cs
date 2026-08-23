using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Taskify.Repository.Entities;

namespace Taskify.Repository.Configurations;

public class UserSessionConfiguration : IEntityTypeConfiguration<UserSession>
{
    public void Configure(EntityTypeBuilder<UserSession> builder)
    {
        builder.ToTable("UserSessions");

        builder.HasKey(session => session.Id);

        builder.Property(session => session.TokenId)
            .IsRequired();

        builder.HasIndex(session => session.TokenId)
            .IsUnique();

        builder.Property(session => session.CreatedAt)
            .IsRequired();

        builder.Property(session => session.ExpiresAt)
            .IsRequired();

        builder.Property(session => session.LastActivityAt)
            .IsRequired();

        builder.Property(session => session.IsRevoked)
            .IsRequired()
            .HasDefaultValue(false);

        builder.HasOne(session => session.User)
            .WithMany(user => user.Sessions)
            .HasForeignKey(session => session.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}