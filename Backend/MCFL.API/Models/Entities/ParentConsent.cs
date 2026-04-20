using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class ParentConsent
    {
        [Key]
        public int ParentConsentId { get; set; }
        public string ParentName { get; set; } = null!;
        public string ParentEmail { get; set; } = null!;
        public bool ConsentGiven { get; set; }
        public DateTime ConsentGivenAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; } = null!;
    }
}
