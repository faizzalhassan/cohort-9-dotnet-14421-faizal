using Taskify.Business.Exceptions;
using System.Net;
using System.Text.Json;
using FluentValidation;
using Taskify.API.DTOs;
using BusinessValidationException =
    Taskify.Business.Exceptions.ValidationException;
namespace Taskify.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "Unhandled exception occurred while processing {Method} {Path}",
                context.Request.Method,
                context.Request.Path);

            await HandleExceptionAsync(context, exception);
        }
    }

    private static async Task HandleExceptionAsync(
        HttpContext context,
        Exception exception)
    {
        var response = new ErrorResponse();

        switch (exception)
        {
            case FluentValidation.ValidationException validationException:
                context.Response.StatusCode =
                    (int)HttpStatusCode.BadRequest;

                response.Message =
                    "Please correct the highlighted fields.";

                response.Errors =
                    validationException.Errors
                        .GroupBy(error => error.PropertyName)
                        .ToDictionary(
                            group => group.Key,
                            group => group
                                .Select(error => error.ErrorMessage)
                                .Distinct()
                                .ToArray());

                break;

            case BusinessValidationException businessValidationException:

                context.Response.StatusCode =
                    (int)HttpStatusCode.BadRequest;

                response.Message =
                    "Please correct the highlighted fields.";

                response.Errors =
                    businessValidationException.Errors;

                break;

            case ConflictException:
                context.Response.StatusCode =
                    (int)HttpStatusCode.Conflict;

                response.Message = exception.Message;
                break;

            case AuthenticationException:
    context.Response.StatusCode =
        (int)HttpStatusCode.Unauthorized;

    response.Message = exception.Message;
    break;

            default:
                context.Response.StatusCode =
                    (int)HttpStatusCode.InternalServerError;

                response.Message =
                    "An unexpected error occurred.";

                break;
        }

        context.Response.ContentType = "application/json";

        var json = JsonSerializer.Serialize(response);

        await context.Response.WriteAsync(json);
    }
}