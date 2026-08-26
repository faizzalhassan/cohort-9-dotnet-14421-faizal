using Taskify.API.Middleware;
using Taskify.Business.Configuration;
using Microsoft.EntityFrameworkCore;
using Taskify.Repository.Context;
using Taskify.Repository.Interfaces;
using Taskify.Repository.Repositories;
using Taskify.API.Services;
using Taskify.Business.Interfaces;
using Microsoft.AspNetCore.Identity;
using Taskify.Repository.Entities;
using Taskify.Business.Services;
using FluentValidation;
using Taskify.Business.Validators;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Hosting;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File(
        "Logs/taskify-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30)
    .CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Serilog
    builder.Host.UseSerilog();

    // Database
    builder.Services.AddDbContext<TaskifyDbContext>(options =>
        options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection")));

    // Repositories
    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<IUserSessionRepository, UserSessionRepository>();
    builder.Services.AddScoped<ITaskRepository, TaskRepository>();

    // JWT Configuration
    builder.Services.Configure<JwtSettings>(
        builder.Configuration.GetSection("JwtSettings"));

    // FluentValidation
    builder.Services.AddValidatorsFromAssemblyContaining<
        RegisterRequestValidator>();

    // Authentication Services
    builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
    builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
    builder.Services.AddScoped<IAuthService, AuthService>();

    // User Management Services
    builder.Services.AddScoped<
        IUserManagementService,
        UserManagementService>();

    // Task Services
    builder.Services.AddScoped<ITaskService, TaskService>();

    // JWT Authentication
    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            var jwtSettings = builder.Configuration
                .GetSection("JwtSettings")
                .Get<JwtSettings>()
                ?? throw new InvalidOperationException(
                    "JWT settings are not configured.");

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),

                ValidateIssuer = true,
                ValidIssuer = jwtSettings.Issuer,

                ValidateAudience = true,
                ValidAudience = jwtSettings.Audience,

                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero
            };
        });

    // Authorization
    builder.Services.AddAuthorization();

    // Controllers
    builder.Services.AddControllers();

    // CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("TaskifyFrontend", policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });

    var app = builder.Build();

    // Serilog HTTP request logging
    app.UseSerilogRequestLogging();

    // Global exception handling
    app.UseMiddleware<ExceptionHandlingMiddleware>();

    // HTTPS
    app.UseHttpsRedirection();

    // CORS
    app.UseCors("TaskifyFrontend");

    // JWT Authentication
    app.UseAuthentication();

    // Server-side session validation
    app.UseMiddleware<SessionValidationMiddleware>();

    // Authorization
    app.UseAuthorization();

    // Controllers
    app.MapControllers();

    Log.Information("Taskify API started successfully.");

    app.Run();
}
catch (HostAbortedException)
{
    // EF Core design-time operations can intentionally abort the host.
}
catch (Exception exception)
{
    Log.Fatal(
        exception,
        "Taskify API terminated unexpectedly.");
}
finally
{
    Log.CloseAndFlush();
}