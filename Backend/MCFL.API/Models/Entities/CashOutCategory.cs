using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("CashOutCategory")]
    [Index(nameof(CategoryName), IsUnique = true)]
    public class CashOutCategory
    {
        [Key]
        [Column("pkCashOutCategoryId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CashOutCategoryId { get; set; }

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
