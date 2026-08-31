using FluentValidation;
using Taskify.Business.DTOs.Tasks;

namespace Taskify.Business.Validators.Tasks;

public class CreateTaskRequestValidator
    : AbstractValidator<CreateTaskRequest>
{
    public CreateTaskRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(2000);

        RuleFor(x => x.Category)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Priority)
            .InclusiveBetween(1, 4);

        RuleFor(x => x.DueDate)
            .Must(date => date == null || date.Value >= DateTime.UtcNow)
            .WithMessage("Due date cannot be in the past.");
    }
}