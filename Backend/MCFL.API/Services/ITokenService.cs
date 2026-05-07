using MCFL.API.Models.Identity;

namespace MCFL.API.Services;

public interface ITokenService
{
    Task<string> CreateTokenAsync(ApplicationUser user, bool rememberMe = false);
}