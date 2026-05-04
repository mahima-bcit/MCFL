namespace MCFL.API.DTOs.Admin.Scenarios
{
    public class AdminManageScenarioDto
    {
        public int ScenarioId { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public bool IsActive { get; set; }
        public string CreatedAt { get; set; } = "";
        public string UpdatedAt { get; set; } = "";
        public List<AdminManageScenarioChoiceDto> Choices { get; set; } = new();
    }

    public class AdminManageScenarioChoiceDto
    {
        public int ScenarioChoiceId { get; set; }
        public string OptionText { get; set; } = "";
        public string ResultText { get; set; } = "";
        public string? LessonText { get; set; }
        public decimal MoneyImpact { get; set; }
        public int ConfidenceImpact { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }

    public class AdminUpsertScenarioRequestDto
    {
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public List<AdminUpsertScenarioChoiceRequestDto> Choices { get; set; } = new();
    }

    public class AdminUpsertScenarioChoiceRequestDto
    {
        public int? ScenarioChoiceId { get; set; }
        public string OptionText { get; set; } = "";
        public string ResultText { get; set; } = "";
        public string? LessonText { get; set; }
        public decimal MoneyImpact { get; set; }
        public int ConfidenceImpact { get; set; }
    }
}
