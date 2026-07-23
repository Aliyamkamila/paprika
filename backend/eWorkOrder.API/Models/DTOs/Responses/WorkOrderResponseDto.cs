namespace eWorkOrder.API.Models.Responses
{
    public class WorkOrderListResponseDto
    {
        public int TotalData { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public List<WorkOrderSummaryDto> Data { get; set; } = new();
    }

    public class WorkOrderSummaryDto
    {
        public string? WoNumber { get; set; }
        public string? Description { get; set; }
        public int? Quantity { get; set; }
        public string? WoStatus { get; set; }
        public string? PlannerCode { get; set; }
        public string? CurrentOperation { get; set; }
        public string? Department { get; set; }
        public int OperationCount { get; set; }
    }
}