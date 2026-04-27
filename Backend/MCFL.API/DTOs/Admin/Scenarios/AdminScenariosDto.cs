namespace MCFL.API.DTOs.Admin.Scenarios
{
    public class AdminScenariosDto
    {
        public int TotalScenarios { get; set; }
        public int TotalCompletions { get; set; }
        public double AvgConfidenceGain { get; set; }
        public decimal AvgMoneyImpact { get; set; }
        public List<AdminScenarioSummaryDto> Scenarios { get; set; } = new();
    }

    public class AdminScenarioSummaryDto
    {
        public int ScenarioId { get; set; }
        public string Title { get; set; } = "";
        public string MostPopularChoice { get; set; } = "";
        public int Completions { get; set; }
        public double AvgConfidenceGain { get; set; }
        public decimal AvgMoneyImpact { get; set; }
        public double PercentageOfTotal { get; set; }
    }
}
