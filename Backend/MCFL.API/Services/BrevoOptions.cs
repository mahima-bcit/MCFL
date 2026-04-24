using MCFL.API.Services;

namespace MCFL.API.Services;

public class BrevoOptions
{
    public string ApiKey { get; set; } = null!;
    public string SenderEmail { get; set; } = null!;
    public string SenderName { get; set; } = "Money Confidence";
}