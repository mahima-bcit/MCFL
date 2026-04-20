using MCFL.API.Models.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("ParentAccessLink")]
    [Index(nameof(Token), IsUnique = true)]
    public class ParentAccessLink
    {
        [Key]
        [Column("pkParentAccessLinkId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ParentAccessLinkId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("token")]
        public string Token { get; set; } = null!;

        [Column("isActive")]
        public bool IsActive { get; set; }

        [Column("expiresAt")]
        public DateTime? ExpiresAt { get; set; }

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("fkUserId")]
        public string UserId { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;
    }
}
