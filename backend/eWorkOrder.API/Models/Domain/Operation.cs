namespace eWorkOrder.API.Models.Domain
{
    public class Operation
    {
        public string?   OperationNum  { get; set; }
        public string?   Description   { get; set; }
        public string?   Status        { get; set; }
        public string?   DepartmentCode{ get; set; }
        public string?   MachineCode   { get; set; }
        public string?   ResourceCode  { get; set; }
        public string?   EmployeeId    { get; set; }
        public string?   EmployeeName  { get; set; }
        public decimal   StdHours      { get; set; }
        public decimal   ActHours      { get; set; }
        public DateTime? ClockIn       { get; set; }
        public DateTime? ClockOut      { get; set; }
    }
}