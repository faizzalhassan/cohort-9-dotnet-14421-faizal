using System.IdentityModel.Tokens.Jwt;
using FluentAssertions;
using Microsoft.Extensions.Options;
using TaskManagement.Business.Helpers;
using TaskManagement.Business.Settings;
using TaskManagement.Repository.Entities;
using Xunit;

namespace TaskManagement.Tests.Helpers;

public class JwtTokenGeneratorTests
{
    [Fact]
    public void GenerateToken_ShouldReturnValidToken()
    {
        // Arrange
        var settings = Options.Create(new JwtSettings
        {
            Key = "ThisIsASuperSecretKeyForUnitTesting123456789",
            Issuer = "TaskManagementAPI",
            Audience = "TaskManagementClient",
            ExpiryMinutes = 60
        });

        var jwtGenerator = new JwtTokenGenerator(settings);

        var user = new User
        {
            Id = 1,
            FirstName = "Faizal",
            LastName = "Hassan",
            Email = "faizal@test.com",
            Role = UserRole.User
        };

        // Act
        var token = jwtGenerator.GenerateToken(user);

        // Assert
        token.Should().NotBeNullOrWhiteSpace();
    }
    [Fact]
public void GenerateToken_ShouldContainThreeParts()
{
    // Arrange
    var settings = Options.Create(new JwtSettings
    {
        Key = "ThisIsASuperSecretKeyForUnitTesting123456789",
        Issuer = "TaskManagementAPI",
        Audience = "TaskManagementClient",
        ExpiryMinutes = 60
    });

    var jwtGenerator = new JwtTokenGenerator(settings);

    var user = new User
    {
        Id = 1,
        FirstName = "Faizal",
        LastName = "Hassan",
        Email = "faizal@test.com",
        Role = UserRole.User
    };

    // Act
    var token = jwtGenerator.GenerateToken(user);

    // Assert
    token.Split('.').Should().HaveCount(3);
}
[Fact]
public void GenerateToken_ShouldIncludeEmailClaim()
{
    // Arrange
    var settings = Options.Create(new JwtSettings
    {
        Key = "ThisIsASuperSecretKeyForUnitTesting123456789",
        Issuer = "TaskManagementAPI",
        Audience = "TaskManagementClient",
        ExpiryMinutes = 60
    });

    var jwtGenerator = new JwtTokenGenerator(settings);

    var user = new User
    {
        Id = 1,
        FirstName = "Faizal",
        LastName = "Hassan",
        Email = "faizal@test.com",
        Role = UserRole.User
    };

    // Act
    var token = jwtGenerator.GenerateToken(user);

    var handler = new JwtSecurityTokenHandler();
    var jwt = handler.ReadJwtToken(token);

    // Assert
    jwt.Claims.First(x => x.Type == JwtRegisteredClaimNames.Email)
        .Value.Should().Be("faizal@test.com");
}
}