using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManagement.API.Controllers;
using TaskManagement.Business.DTOs.Auth;
using TaskManagement.Business.Interfaces;
using Xunit;

namespace TaskManagement.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();

        _controller = new AuthController(
            _authServiceMock.Object);
    }

        [Fact]
    public async Task Register_ReturnsOk_WhenRegistrationSucceeds()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FirstName = "Faizal",
            LastName = "Hassan",
            Email = "faizal@test.com",
            Password = "Password123!"
        };

        var response = new AuthResponse
        {
            Token = "fake-jwt",
            Email = request.Email,
            FullName = "Faizal Hassan",
            Role = "User"
        };

        _authServiceMock
            .Setup(x => x.RegisterAsync(request))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.Register(request);

        // Assert
        result.Should().BeOfType<OkObjectResult>();

        var okResult = result as OkObjectResult;

        okResult!.Value.Should().Be(response);
    }

        [Fact]
    public async Task Login_ReturnsOk_WhenLoginSucceeds()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "faizal@test.com",
            Password = "Password123!"
        };

        var response = new AuthResponse
        {
            Token = "fake-jwt",
            Email = request.Email,
            FullName = "Faizal Hassan",
            Role = "User"
        };

        _authServiceMock
            .Setup(x => x.LoginAsync(request))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.Login(request);

        // Assert
        result.Should().BeOfType<OkObjectResult>();

        var okResult = result as OkObjectResult;

        okResult!.Value.Should().Be(response);
    }
    [Fact]
public void Me_ReturnsAuthenticatedUser()
{
    // Arrange
    var claims = new[]
    {
        new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, "Faizal Hassan"),
        new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, "faizal@test.com"),
        new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "User")
    };

    var identity = new System.Security.Claims.ClaimsIdentity(claims, "TestAuth");
    var principal = new System.Security.Claims.ClaimsPrincipal(identity);

    _controller.ControllerContext = new ControllerContext
    {
        HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext
        {
            User = principal
        }
    };

    // Act
    var result = _controller.Me();

    // Assert
    result.Should().BeOfType<OkObjectResult>();

    var okResult = result as OkObjectResult;
    okResult.Should().NotBeNull();
}
}