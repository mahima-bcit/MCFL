using MCFL.API.Models.Entities;
using MCFL.API.Models.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("UserProfile")]
    [Index(nameof(UserId), IsUnique = true)]
    public class UserProfile
    {
        [Key]
        [Column("pkUserProfileId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserProfileId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("fullName")]
        public string FullName { get; set; } = null!;

        [MaxLength(50)]
        [Column("nickName")]
        public string? NickName { get; set; }

        [Column("dateOfBirth", TypeName = "date")]
        public DateOnly DateOfBirth { get; set; }

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

        [Column("learningComments", TypeName = "TEXT")]
        public string? LearningComments { get; set; }

        [Column("parentTeachingsAnswer", TypeName = "TEXT")]
        public string? ParentTeachingsAnswer { get; set; }

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("fkUserId")]
        public string UserId { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;

        public ICollection<UserLearningPreference> UserLearningPreferences { get; set; } = new List<UserLearningPreference>();
    }
}
