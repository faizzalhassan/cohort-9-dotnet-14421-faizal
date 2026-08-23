namespace Taskify.API.DTOs;

public class ErrorResponse
{
    public bool Success { get; set; } = false;

    public string Message { get; set; } = string.Empty;

    public IDictionary<string, string[]>? Errors { get; set; }
}