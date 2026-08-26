using FluentValidation.TestHelper;
using Taskify.Business.DTOs.Auth;
using Taskify.Business.Validators;
using Xunit;

namespace Taskify.Tests.Validators;

public class LoginValidatorTests
{
    private readonly LoginRequestValidator _validator;

    public LoginValidatorTests()
    {
        _validator = new LoginRequestValidator();
    }

    [Fact]
    public void ValidLoginRequest_ShouldNotHaveErrors()
    {
        var request = new LoginRequest
        {
            Email = "faizal@gmail.com",
            Password = "Faizal123@"
        };

        var result = _validator.TestValidate(request);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void EmptyEmail_ShouldHaveValidationError()
    {
        var request = new LoginRequest
        {
            Email = "",
            Password = "Faizal123@"
        };

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void InvalidEmail_ShouldHaveValidationError()
    {
        var request = new LoginRequest
        {
            Email = "invalid-email",
            Password = "Faizal123@"
        };

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void EmptyPassword_ShouldHaveValidationError()
    {
        var request = new LoginRequest
        {
            Email = "faizal@gmail.com",
            Password = ""
        };

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(x => x.Password);
    }
}