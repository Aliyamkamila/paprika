namespace eWorkOrder.API.Models.Responses
{
    public class WorkOrderDetailDto
    {
        public string? WoNumber { get; set; }
        public string? Description { get; set; }
        public int? Quantity { get; set; }
        public string? WoStatus { get; set; }
        public string? PlannerCode { get; set; }
        public string? Department { get; set; }
        public string? WoStartDate { get; set; }
        public string? WoEndDate { get; set; }
        public List<OperationTimelineDto> Operations { get; set; } = new();
    }

    public class OperationTimelineDto
    {
        public string? OperationNum { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public string? Department { get; set; }
        public string? Machine { get; set; }
        public string? EmployeeName { get; set; }
        public decimal? StdHours { get; set; }
        public decimal? ActHours { get; set; }
        public string? ClockIn { get; set; }
        public string? ClockOut { get; set; }
    }
}