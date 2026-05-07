using Microsoft.Extensions.Options;
using System.Net.Http.Headers;

namespace MCFL.API.Services;

public class BrevoEmailSender : IEmailSender
{
    private readonly HttpClient _client;
    private readonly BrevoOptions _options;
    private readonly ILogger<BrevoEmailSender> _logger;

    public BrevoEmailSender(HttpClient client, IOptions<BrevoOptions> options, ILogger<BrevoEmailSender> logger)
    {
        _client = client;
        _options = options.Value;
        _logger = logger;

        _client.BaseAddress = new Uri("https://api.brevo.com/v3/");
        if (!string.IsNullOrEmpty(_options.ApiKey))
            _client.DefaultRequestHeaders.Add("api-key", _options.ApiKey);

        _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
    {
        var payload = new
        {
            sender = new { name = _options.SenderName, email = _options.SenderEmail },
            to = new[] { new { email = toEmail } },
            subject,
            htmlContent = htmlMessage
        };

        var resp = await _client.PostAsJsonAsync("smtp/email", payload);
        if (!resp.IsSuccessStatusCode)
        {
            var body = await resp.Content.ReadAsStringAsync();
            _logger.LogError("Brevo send failed ({StatusCode}) {Body}", resp.StatusCode, body);
            resp.EnsureSuccessStatusCode();
        }
    }
}