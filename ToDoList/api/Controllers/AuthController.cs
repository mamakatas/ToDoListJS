using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using ToDoList.Models;
using ToDoList.Dtos;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (registerDto == null)
            return BadRequest("Invalid user data.");

        var user = new AppUser
        {
            UserName = registerDto.UserName,
            FullName = registerDto.FullName,
            Email = registerDto.Email
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            return Ok(new { message = "User registered successfully." });
        }

        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var user = await _userManager.FindByNameAsync(loginDto.UserName);

        if (user == null)
            return Unauthorized("Invalid credentials.");

        var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, false, false);

        if (!result.Succeeded)
            return Unauthorized("Invalid credentials.");

        var token = await GenerateJwtToken(user);

        return Ok(new { token });
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
    {
        var user = await _userManager.FindByNameAsync(changePasswordDto.UserName);
        if (user == null)
            return NotFound("User not found.");

        var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { message = "Password changed successfully." });
    }


    private async Task<string> GenerateJwtToken(AppUser user)
    {
        var userRoles = await _userManager.GetRolesAsync(user);

        var claims = new List<System.Security.Claims.Claim>
        {
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, user.Id),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, user.UserName)
        };

        foreach (var role in userRoles)
        {
            claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:Issuer"],
            audience: _configuration["JWT:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }


    [HttpGet("profile")]
    public async Task<IActionResult> GetAllProfiles()
    {
        var users = _userManager.Users.ToList();
        if (users == null || !users.Any())
        {
            return NotFound("No users found.");
        }

        var userProfiles = users.Select(user => new
        {
            user.Id,
            user.UserName,
            user.FullName,
            user.Email
        });

        return Ok(userProfiles);
    }
}
