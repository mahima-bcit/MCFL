using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models.DTOs;

public class RegisterRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = null!;

    [Required, MinLength(6)]
    public string Password { get; set; } = null!;

    [Required]
    public string FullName { get; set; } = null!;

    public string? Nickname { get; set; }

    [Required]
    public DateOnly DateOfBirth { get; set; }

    public bool RequiresParentConsent { get; set; }

    public ParentAuthorizationRequest? ParentAuthorization { get; set; }

    [Required]
    public ProfileSetupRequest ProfileSetup { get; set; } = null!;
}

public class ParentAuthorizationRequest
{
    [Required]
    public bool Authorized { get; set; }

    [Required, MaxLength(100)]
    public string ParentGuardianName { get; set; } = null!;

    [Required, EmailAddress, MaxLength(255)]
    public string ParentGuardianEmail { get; set; } = null!;
}

public class ProfileSetupRequest
{
    [Required]
    public string BankAccount { get; set; } = null!;

    [Required]
    public string EarnMoney { get; set; } = null!;

    [Required]
    public string HaveSavings { get; set; } = null!;

    [Required]
    public string PayBills { get; set; } = null!;

    [Required]
    public string SpendOnWants { get; set; } = null!;

    public Dictionary<string, string> Beliefs { get; set; } = new();

    public string? ParentsTaughtMoney { get; set; }

    public List<string> LearningGoals { get; set; } = new();

    public string? LearningGoalText { get; set; }
}
