namespace MCFL.API.DTOs.Game
{
    public class ApplyChoiceRequest
    {
        public String UserId { get; set; } = null!;
        public int ScenarioChoiceId { get; set; }
    }
}
