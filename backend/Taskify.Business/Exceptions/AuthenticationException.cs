namespace Taskify.Business.Exceptions;

public class AuthenticationException : Exception
{
    public AuthenticationException(string message)
        : base(message)
    {
    }
}