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

        // Routing sheet fields
        public string? AssemblyNo { get; set; }
        public string? SerialNo { get; set; }
        public string? SalesOrder { get; set; }
        public string? LotNo { get; set; }
        public string? BarcodeJobNo { get; set; }
        public string? BarcodeAssembly { get; set; }

        public List<RoutingOpSummaryDto> Operations { get; set; } = new();
    }

    public class RoutingOpSummaryDto
    {
        // Existing timeline fields
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

        // Routing fields
        public string? BarcodeValue { get; set; }
        public int WorkInstructionCount { get; set; }
        public int MaterialCount { get; set; }
        public bool HasRoutingData { get; set; }
    }
}
