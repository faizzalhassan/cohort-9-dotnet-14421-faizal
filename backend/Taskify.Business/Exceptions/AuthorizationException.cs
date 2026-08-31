namespace Taskify.Business.Exceptions;

public class AuthorizationException : Exception
{
    public AuthorizationException(string message) 
        : base(message)
    {
    }
}