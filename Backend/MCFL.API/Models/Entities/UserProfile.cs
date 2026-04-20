using MCFL.API.Models.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("UserProfile")]
    [Index(nameof(UserId), IsUnique = true)]
    public class UserProfile
    {
        [Key]
        [Column("pkUserProfileId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserProfileId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("fullName")]
        public string FullName { get; set; } = null!;

        [MaxLength(50)]
        [Column("nickName")]
        public string? NickName { get; set; }

        [Column("dateOfBirth", TypeName = "date")]
        public DateOnly DateOfBirth { get; set; }

        [Required]
        [Column("moneyHabitsAnswer", TypeName = "TEXT")]
        public string MoneyHabitAnswer { get; set; } = null!;

        [Required]
        [Column("moneyLearningAnswer", TypeName = "TEXT")]
        public string MoneyLearningAnswer { get; set; } = null!;

        [Required]
        [Column("whatUserWantsToLearnAnswer", TypeName = "TEXT")]
        public string WhatUserWantsToLearnAnswer { get; set; } = null!;

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("fkUserId")]
        public string UserId { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;
    }
}
