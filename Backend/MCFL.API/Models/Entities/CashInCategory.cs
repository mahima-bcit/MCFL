using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class CashInCategory
    {
        [Key]
        public int CashInCategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
    }
}
