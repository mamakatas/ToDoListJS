using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ToDoList.Business.Interfaces;
using ToDoList.Business.Repositories;
using ToDoList.Data;
using ToDoList.Data.DataAccess;
using ToDoList.Interfaces;
using ToDoList.Models;
using ToDoList.Repositories;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy  =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<AppUser, IdentityRole>()
 .AddEntityFrameworkStores<ApplicationDbContext>()
 .AddDefaultTokenProviders();

builder.Services.AddScoped<ITasksDal, EfTasksDal>();
builder.Services.AddScoped<IMessagesDal, EfMessagesDal>();
builder.Services.AddScoped<ITaskRepository, TasksRepository>();
builder.Services.AddScoped<IMessageRepository, MessagesRepository>();


builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter JWT Bearer token",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

static async Task SeedRoles(IServiceProvider serviceProvider, UserManager<AppUser> userManager)
{
    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    // Admin rolünü oluştur
    var adminRole = new IdentityRole("Admin");
    var userRole = new IdentityRole("User");

    var roleExist = await roleManager.RoleExistsAsync(adminRole.Name);
    if (!roleExist)
    {
        await roleManager.CreateAsync(adminRole);
    }

    roleExist = await roleManager.RoleExistsAsync(userRole.Name);
    if (!roleExist)
    {
        await roleManager.CreateAsync(userRole);
    }

    // Admin kullanıcıyı yaratmak
    var adminUser = await userManager.FindByEmailAsync("admin123@admin.com");
    if (adminUser == null)
    {
        adminUser = new AppUser
        {
            UserName = "admin123",
            Email = "admin123@admin.com",
            FullName = "Admin User"
        };

        await userManager.CreateAsync(adminUser, "Admin@123");
    }

    await userManager.AddToRoleAsync(adminUser, "Admin");

    // Regular User
    var user = await userManager.FindByEmailAsync("user@user.com");
    if (user == null)
    {
        user = new AppUser
        {
            UserName = "user",
            Email = "user@user.com",
            FullName = "Regular User"
        };

        await userManager.CreateAsync(user, "User@123");
    }

    await userManager.AddToRoleAsync(user, "User");
}

builder.Services.Configure<IdentityOptions>(options =>
{
    // Default Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;   
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"])
            )
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    // Ensure the Admin role exists
    if (!await roleManager.RoleExistsAsync("Admin"))
    {
        await roleManager.CreateAsync(new IdentityRole("Admin"));
    }

    // Find the admin user
    var adminUser = await userManager.FindByNameAsync("admin");
    if (adminUser != null)
    {
        // Remove from other roles if needed
        var roles = await userManager.GetRolesAsync(adminUser);
        foreach (var role in roles)
        {
            await userManager.RemoveFromRoleAsync(adminUser, role);
        }
        // Add to Admin role
        await userManager.AddToRoleAsync(adminUser, "Admin");
    }
}

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication(); // Kullanıcı kimlik doğrulama
app.UseAuthorization();

app.MapControllers();
app.Run();

