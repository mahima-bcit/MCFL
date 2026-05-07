using System.ComponentModel.DataAnnotations;

namespace MCFL.API.DTOs;

public class ParentFeedbackRequestDto
{
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string ParentEmail { get; set; } = null!;

    [MaxLength(100)]
    public string? ParentName { get; set; }

    [Required]
    public string MoneyStory { get; set; } = null!;

    [Required]
    public string WhatChildShouldLearn { get; set; } = null!;

    [Required]
    public string Token { get; set; } = null!;
}
