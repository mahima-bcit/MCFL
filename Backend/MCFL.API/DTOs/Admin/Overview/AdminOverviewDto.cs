namespace MCFL.API.DTOs.Admin.Overview
{
    public class AdminOverviewDto
    {
        public string RangeKey { get; set; } = "";
        public string DateFrom { get; set; } = "";
        public string DateTo { get; set; } = "";
        public int TotalUsers { get; set; }
        public int AvgConfidence { get; set; }
        public decimal AvgSavings { get; set; }
        public int ScenariosCompleted { get; set; }
        public int DecisionQuality { get; set; }

        public List<UserGrowthPointDto> UserGrowthSeries { get; set; } = new();
    }

    public class UserGrowthPointDto
    {
        public string Label { get; set; } = "";
        public int Value { get; set; }
    }
}
