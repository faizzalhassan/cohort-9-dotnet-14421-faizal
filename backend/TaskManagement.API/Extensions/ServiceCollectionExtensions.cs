using FluentValidation;
using TaskManagement.Business.Helpers;
using TaskManagement.Business.Services;
using TaskManagement.Business.Interfaces;
using TaskManagement.Business.Validators;
using TaskManagement.Repository.Interfaces;
using TaskManagement.Repository.Repositories;

namespace TaskManagement.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
        services.AddScoped<IAuthService, AuthService>();
services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        return services;
    }
}