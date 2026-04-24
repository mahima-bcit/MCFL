using MCFL.API.Models.Identity;
using System.Threading.Tasks;

namespace MCFL.API.Services;

public interface ITokenService
{
    Task<string> CreateTokenAsync(ApplicationUser user, bool rememberMe = false);
}