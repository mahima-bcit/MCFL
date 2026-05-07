using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("UserFinancialProfile")]
    [Index(nameof(UserProfileId), IsUnique = true)]
    public class UserFinancialProfile
    {
        [Key]
        [Column("pkUserFinancialProfileId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserFinancialProfileId { get; set; }

        [Required]
        [Column("fkUserProfileId")]
        public int UserProfileId { get; set; }

        [Required]
        [Column("hasBankAccount")]
        public bool HasBankAccount { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("earnsMoneyAnswer")]
        public string EarnsMoneyAnswer { get; set; } = null!;

        [Required]
        [MaxLength(20)]
        [Column("hasSavingsAnswer")]
        public string HasSavingsAnswer { get; set; } = null!;

        [Required]
        [MaxLength(20)]
        [Column("paysBillsAnswer")]
        public string PaysBillsAnswer { get; set; } = null!;

        [Required]
        [MaxLength(20)]
        [Column("spendsOnWantsAnswer")]
        public string SpendsOnWantsAnswer { get; set; } = null!;

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(UserProfileId))]
        public UserProfile UserProfile { get; set; } = null!;
    }
}
