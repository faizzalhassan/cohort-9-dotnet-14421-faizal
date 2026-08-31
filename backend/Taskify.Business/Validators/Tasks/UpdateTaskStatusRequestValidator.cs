using FluentValidation;
using Taskify.Business.DTOs.Tasks;

namespace Taskify.Business.Validators.Tasks;

public class UpdateTaskStatusRequestValidator
    : AbstractValidator<UpdateTaskStatusRequest>
{
    public UpdateTaskStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .InclusiveBetween(1, 4);
    }
}