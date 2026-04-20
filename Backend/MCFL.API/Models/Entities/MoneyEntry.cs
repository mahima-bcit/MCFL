using MCFL.API.Models.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("MoneyEntry")]
    public class MoneyEntry
    {
        [Key]
        [Column("pkMoneyEntryId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MoneyEntryId { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("entryType")]
        public string EntryType { get; set; } = null!;

        [Precision(10, 2)]
        [Column("amount")]
        public decimal Amount { get; set; }

        [MaxLength(255)]
        [Column("comment")]
        public string? Comment { get; set; }

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("fkUserId")]
        public string UserId { get; set; } = null!;

        [Column("fkCashInCategoryId")]
        public int? CashInCategoryId { get; set; }

        [Column("fkCashOutCategoryId")]
        public int? CashOutCategoryId { get; set; }

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;

        [ForeignKey(nameof(CashInCategoryId))]
        public CashInCategory? CashInCategory { get; set; }

        [ForeignKey(nameof(CashOutCategoryId))]
        public CashOutCategory? CashOutCategory { get; set; }

    }
}
