namespace eWorkOrder.API.Models.Responses
{
    public class OperationDetailDto
    {
        public string?                    OperationNum         { get; set; }
        public string?                    Description          { get; set; }
        public string?                    Status               { get; set; }
        public string?                    Department           { get; set; }
        public string?                    Machine              { get; set; }
        public string?                    BarcodeValue         { get; set; }
        public string?                    ScheduledStart       { get; set; }
        public string?                    ScheduledFinish      { get; set; }
        public string?                    ReviewedBy           { get; set; }
        public string?                    ReviewedAt           { get; set; }
        public List<WorkInstructionDto>   WorkInstructions     { get; set; } = new();
        public List<MaterialDto>          Materials            { get; set; } = new();
        public List<EmployeeDto>          Employees            { get; set; } = new();
        public List<NoteDto>              Notes                { get; set; } = new();
    }

    public class WorkInstructionDto
    {
        public int?    SeqNo           { get; set; }
        public string? InstructionText { get; set; }
        public string? InspectType     { get; set; }
        public string? WfId            { get; set; }
        public string? Scope           { get; set; }
    }

    public class MaterialDto
    {
        public string?  ComponentItem { get; set; }
        public string?  Description   { get; set; }
        public string?  SupplyType    { get; set; }
        public string?  DateRequired  { get; set; }
        public string?  Uom           { get; set; }
        public decimal? RequiredQty   { get; set; }
    }

    public class EmployeeDto
    {
        public string?  EmployeeId   { get; set; }
        public string?  EmployeeName { get; set; }
        public string?  ClockIn      { get; set; }
        public string?  ClockOut     { get; set; }
        public decimal? StdHours     { get; set; }
        public decimal? ActHours     { get; set; }
    }

    public class NoteDto
    {
        public string? NoteText   { get; set; }
        public string? AuthorName { get; set; }
        public string? AuthorDept { get; set; }
        public string? CreatedAt  { get; set; }
    }
}