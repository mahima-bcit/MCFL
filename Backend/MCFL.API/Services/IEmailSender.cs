using MCFL.API.Services;    
using System.Threading.Tasks;

namespace MCFL.API.Services;

public interface IEmailSender
{
    Task SendEmailAsync(string toEmail, string subject, string htmlMessage);
}