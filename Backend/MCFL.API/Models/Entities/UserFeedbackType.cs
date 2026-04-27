using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("UserFeedbackType")]
    [Index(nameof(Name), IsUnique = true)]
    public class UserFeedbackType
    {
        [Key]
        [Column("pkUserFeedbackTypeId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserFeedbackTypeId { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("name")]
        public string Name { get; set; } = null!;

        [Required]
        [Column("isActive")]
        public bool IsActive { get; set; } = true;

        [Required]
        [Column("sortOrder")]
        public int SortOrder { get; set; }

        public ICollection<UserFeedback> UserFeedbacks { get; set; } = new List<UserFeedback>();
    }
}
