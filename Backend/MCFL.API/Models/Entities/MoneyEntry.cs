using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class MoneyEntry
    {
        [Key]
        public int MoneyEntryId { get; set; }
        public int EntryType { get; set; }
        public decimal Amount { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; } = null!;
        public int CashInCategoryId { get; set; }
        public int CashOutCategoryId { get; set; }

    }
}
