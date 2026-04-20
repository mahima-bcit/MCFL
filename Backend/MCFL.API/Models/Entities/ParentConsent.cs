using MCFL.API.Models.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("ParentConsent")]
    [Index(nameof(UserId), IsUnique = true)]
    public class ParentConsent
    {
        [Key]
        [Column("pkParentConsentId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ParentConsentId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("parentName")]
        public string ParentName { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        [EmailAddress]
        [Column("parentEmail")]
        public string ParentEmail { get; set; } = null!;

        [Column("consentGiven")]
        public bool ConsentGiven { get; set; }

        [Column("consentGivenAt")]
        public DateTime ConsentGivenAt { get; set; }

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("fkUserId")]
        public string UserId { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;
    }
}
