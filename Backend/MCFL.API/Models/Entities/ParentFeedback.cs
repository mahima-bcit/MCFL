using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class ParentFeedback
    {
        [Key]
        public int ParentFeedbackId { get; set; }
        public string MoneyStory { get; set; } = null!;

        public string WhatChildShouldLearn { get; set; } = null!;
        public DateTime SubmittedAt { get; set; }
        public int ParentAccessLinkId { get; set; }
    }
}
