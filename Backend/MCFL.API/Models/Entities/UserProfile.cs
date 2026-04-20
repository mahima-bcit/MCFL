using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class UserProfile
    {
        [Key]
        public int UserProfileId { get; set; }
        public string FullName { get; set; } = null!;
        public string NickName { get; set; } = null!;
        public DateOnly DateOfBirth { get; set; }
        public string MoneyHabitAnswer { get; set; } = null!;
        public string MoneyLearningAnswer { get; set; } = null!;
        public string WhatUserWantsToLearnAnswer { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string UserId { get; set; } = null!;
    }
}
