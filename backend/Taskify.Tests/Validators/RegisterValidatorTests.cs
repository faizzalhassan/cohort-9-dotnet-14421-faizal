using FluentValidation.TestHelper;
using Taskify.Business.DTOs.Auth;
using Taskify.Business.Validators;
using Xunit;

namespace Taskify.Tests.Validators;

public class RegisterValidatorTests
{
    private readonly RegisterRequestValidator _validator;

    public RegisterValidatorTests()
    {
        _validator = new RegisterRequestValidator();
    }

    [Fact]
    public void ValidRegisterRequest_ShouldNotHaveErrors()
    {
        var request = new RegisterRequest
        {
            FirstName = "Faizal",
            LastName = "Hassan",
            Email = "faizal@gmail.com",
            Password = "Faizal123@",
            ConfirmPassword = "Faizal123@"
        };

        var result = _validator.TestValidate(request);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void EmptyFirstName_ShouldHaveValidationError()
    {
        var request = new RegisterRequest
        {
            FirstName = "",
            LastName = "Hassan",
            Email = "faizal@gmail.com",
            Password = "Faizal123@",
            ConfirmPassword = "Faizal123@"
        };

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Fact]
    public void InvalidEmail_ShouldHaveValidationError()
    {
        var request = new RegisterRequest
        {
            FirstName = "Faizal",
            LastName = "Hassan",
            Email = "invalid-email",
            Password = "Faizal123@",
            ConfirmPassword = "Faizal123@"
        };

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void WeakPassword_ShouldHaveValidationError()
    {
        var request = new RegisterRequest
        {
            FirstName = "Faizal",
            LastName = "Hassan",
            Email = "faizal@gmail.com",
            Password = "123",
            ConfirmPassword = "123"
        };

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void PasswordMismatch_ShouldHaveValidationError()
    {
        var request = new RegisterRequest
        {
            FirstName = "Faizal",
            LastName = "Hassan",
            Email = "faizal@gmail.com",
            Password = "Faizal123@",
            ConfirmPassword = "Different123@"
        };

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(x => x.ConfirmPassword);
    }
}