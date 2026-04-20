using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class ParentAccessLink
    {
        [Key]
        public int ParentAccessLinkId { get; set; }
        public string Token { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; } = null!;
    }
}
