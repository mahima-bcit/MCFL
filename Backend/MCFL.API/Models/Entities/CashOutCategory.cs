using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class CashOutCategory
    {
        [Key]
        public int CashOutCategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
    }
}
