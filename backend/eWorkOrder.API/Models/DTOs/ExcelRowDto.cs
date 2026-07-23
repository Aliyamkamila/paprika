namespace eWorkOrder.API.Models.DTOs
{
    public class ExcelRowDto
    {
        public string?   WoNumber       { get; set; }
        public string?   Description    { get; set; }
        public int?      Quantity       { get; set; }
        public string?   WoStatus       { get; set; }
        public string?   OperationNum   { get; set; }
        public string?   OpDescription  { get; set; }
        public string?   OpStatus       { get; set; }
        public string?   DepartmentCode { get; set; }
        public string?   MachineCode    { get; set; }
        public string?   ResourceCode   { get; set; }
        public string?   EmployeeId     { get; set; }
        public string?   EmployeeName   { get; set; }
        public decimal?  StdHours       { get; set; }
        public decimal?  ActHours       { get; set; }
        public DateTime? ClockIn        { get; set; }
        public DateTime? ClockOut       { get; set; }
    }
}