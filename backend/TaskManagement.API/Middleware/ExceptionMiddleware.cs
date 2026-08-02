using System.Net;
using System.Text.Json;

namespace TaskManagement.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger)
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
        catch (Exception ex)
        {
            switch (ex)
{
    case UnauthorizedAccessException:
    case InvalidOperationException:
    case ArgumentException:
    case KeyNotFoundException:
        _logger.LogWarning(ex.Message);
        break;

    default:
        _logger.LogError(ex, ex.Message);
        break;
}
            context.Response.ContentType = "application/json";

            context.Response.StatusCode = ex switch
            {
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,

                KeyNotFoundException => StatusCodes.Status404NotFound,

                ArgumentException => StatusCodes.Status400BadRequest,

                InvalidOperationException => StatusCodes.Status409Conflict,

                _ => StatusCodes.Status500InternalServerError
            };

            var response = new
            {
                success = false,
                statusCode = context.Response.StatusCode,
                message = ex.Message
            };

            var json = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(json);
        }
    }
}