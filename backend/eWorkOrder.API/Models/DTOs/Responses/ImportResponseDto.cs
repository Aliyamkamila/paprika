namespace eWorkOrder.API.Models.Responses
{
    public class ImportResponseDto
    {
        public bool Success { get; set; }
        public int TotalRows { get; set; }
        public int ValidRows { get; set; }
        public int InvalidRows { get; set; }
        public string? Message { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}