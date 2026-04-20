using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("ParentFeedback")]
    public class ParentFeedback
    {
        [Key]
        [Column("pkParentFeedbackId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ParentFeedbackId { get; set; }

        [Required]
        [MaxLength(255)]
        [EmailAddress]
        [Column("parentEmail")]
        public string ParentEmail { get; set; } = null!;

        [MaxLength(100)]
        [Column("parentName")]
        public string? ParentName { get; set; }

        [Required]
        [Column("moneyStory", TypeName = "TEXT")]
        public string MoneyStory { get; set; } = null!;

        [Required]
        [Column("whatChildShouldLearn", TypeName = "TEXT")]
        public string WhatChildShouldLearn { get; set; } = null!;

        [Column("submittedAt")]
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        [Column("fkParentAccessLinkId")]
        public int ParentAccessLinkId { get; set; }

        [ForeignKey(nameof(ParentAccessLinkId))]
        public ParentAccessLink ParentAccessLink { get; set; } = null!;
    }
}
