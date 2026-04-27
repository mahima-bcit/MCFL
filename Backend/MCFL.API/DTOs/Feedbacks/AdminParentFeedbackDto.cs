namespace MCFL.API.DTOs.Feedbacks
{
    public class AdminParentFeedbackDto
    {
        public int ParentFeedbackId { get; set; }
        public string ChildName { get; set; } = "";
        public string ParentName { get; set; } = "";
        public string ParentEmail { get; set; } = "";
        public string MoneyStory { get; set; } = "";
        public string WhatChildShouldLearn { get; set; } = "";
        public string SubmittedAt { get; set; } = "";
    }
}
