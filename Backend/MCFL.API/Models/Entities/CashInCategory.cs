using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("CashInCategory")]
    [Index(nameof(CategoryName), IsUnique = true)]
    public class CashInCategory
    {
        [Key]
        [Column("pkCashInCategoryId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CashInCategoryId { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("categoryName")]
        public string CategoryName { get; set; } = null!;

        [Column("isActive")]
        public bool IsActive { get; set; }

        [Column("sortOrder")]
        public int SortOrder { get; set; }
    }
}
