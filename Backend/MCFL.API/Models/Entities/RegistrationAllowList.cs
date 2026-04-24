using MCFL.API.Models.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("RegistrationAllowList")]
    [Index(nameof(Email), IsUnique = true)]
    public class RegistrationAllowList
    {
        [Key]
        [Column("pkRegistrationAllowListId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RegistrationAllowListId { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("email")]
        public string Email { get; set; } = null!;

        public bool IsActive { get; set; } = true;
        public string? AddedByUserId { get; set; }

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
